import request from 'supertest'
import app from '../../index.js'
import Insumo from '../models/insumoModel.js'
import Producto from '../models/productoModel.js'
import Usuario from '../models/usuarioModel.js'

describe('Venta Route Integration - Flujo Mozo-Chef', () => {
    let mozoToken, chefToken, productoId

    beforeEach(async () => {
        // 1. Crear usuarios y obtener tokens
        await request(app).post('/api/usuario/register').send({
            nombre: 'Juan', apellido: 'Mozo', email: 'mozo@rest.com', password: 'Password123'
        })
        const mozoLogin = await request(app).post('/api/usuario/login').send({
            email: 'mozo@rest.com', password: 'Password123'
        })
        mozoToken = mozoLogin.body.token

        // Admin crea al Chef
        const adminData = { nombre: 'Admin', apellido: 'Gastro', email: 'admin@rest.com', password: 'Password123', role: 'ADMIN' }
        const { body: adminBody } = await request(app).post('/api/usuario/register').send(adminData)
        await Usuario.findByIdAndUpdate(adminBody.usuario._id, { role: 'ADMIN' })
        
        const adminLogin = await request(app).post('/api/usuario/login').send({
            email: 'admin@rest.com', password: 'Password123'
        })
        const adminToken = adminLogin.body.token

        const chefRes = await request(app).post('/api/usuario/register-admin')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nombre: 'Pedro', apellido: 'Chef', email: 'chef@rest.com', password: 'Password123', role: 'CHEF' })
        
        const chefLogin = await request(app).post('/api/usuario/login').send({
            email: 'chef@rest.com', password: 'Password123'
        })
        chefToken = chefLogin.body.token

        // 2. Crear Insumo y Producto
        const insumo = await Insumo.create({
            nombre: 'pan', stock_actual: 100, stock_minimo: 5, unidad: 'unidad', costo_unitario: 10
        })
        const producto = await Producto.create({
            nombre: 'Sandwich', precio_venta: 500, tipo: 'directo', insumo_directo: insumo._id
        })
        productoId = producto._id
    })

    test('Flujo Completo: Mozo pide -> Chef cocina -> Mozo entrega', async () => {
        const pedidoRes = await request(app).post('/api/venta')
            .set('Authorization', `Bearer ${mozoToken}`)
            .send({ items: [{ producto_id: productoId, cantidad: 2 }] })
        
        expect(pedidoRes.status).toBe(201)
        const ventaId = pedidoRes.body.venta._id

        const mozoAprueba = await request(app).patch(`/api/venta/${ventaId}/listo`)
            .set('Authorization', `Bearer ${mozoToken}`)
        expect(mozoAprueba.status).toBe(403)

        const chefAprueba = await request(app).patch(`/api/venta/${ventaId}/listo`)
            .set('Authorization', `Bearer ${chefToken}`)
        expect(chefAprueba.status).toBe(200)

        const mozoEntrega = await request(app).patch(`/api/venta/${ventaId}/entregar`)
            .set('Authorization', `Bearer ${mozoToken}`)
        expect(mozoEntrega.status).toBe(200)
    })
})
