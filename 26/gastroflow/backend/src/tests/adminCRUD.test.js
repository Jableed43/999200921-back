import request from 'supertest'
import app from '../../index.js'
import Insumo from '../models/insumoModel.js'
import Producto from '../models/productoModel.js'
import Usuario from '../models/usuarioModel.js'
import mongoose from 'mongoose'

describe('Admin CRUD & Dashboard Integration', () => {
    let adminToken, insumoId, productoId

    beforeEach(async () => {
        const uniqueEmail = `admin_${Math.random()}@crud.com`
        // 1. Crear Admin y login
        const adminRes = await request(app).post('/api/usuario/register').send({
            nombre: 'Admin', apellido: 'Poderoso', email: uniqueEmail, password: 'Password123'
        })
        await Usuario.findByIdAndUpdate(adminRes.body.usuario._id, { role: 'ADMIN' })
        
        const login = await request(app).post('/api/usuario/login').send({
            email: uniqueEmail, password: 'Password123'
        })
        adminToken = login.body.token
    })

    test('Insumos CRUD', async () => {
        // Create
        const resCreate = await request(app).post('/api/insumo')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nombre: 'tomate', stock_actual: 10, stock_minimo: 2, unidad: 'gr', costo_unitario: 5 })
        expect(resCreate.status).toBe(201)
        insumoId = resCreate.body._id

        // Get All
        const resGet = await request(app).get('/api/insumo')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(resGet.body.length).toBeGreaterThan(0)

        // Update
        const resUpdate = await request(app).patch(`/api/insumo/${insumoId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ stock_actual: 20 })
        expect(resUpdate.body.stock_actual).toBe(20)

        // Delete
        const resDel = await request(app).delete(`/api/insumo/${insumoId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(resDel.status).toBe(200)
    })

    test('Productos CRUD', async () => {
        // Create
        const resCreate = await request(app).post('/api/producto')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nombre: 'Ensalada', precio_venta: 1000, tipo: 'compuesto', receta: [] })
        expect(resCreate.status).toBe(201)
        productoId = resCreate.body._id

        // Get
        const resGet = await request(app).get(`/api/producto/${productoId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(resGet.body.nombre).toBe('ensalada') // lowercase

        // Delete
        const resDel = await request(app).delete(`/api/producto/${productoId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(resDel.status).toBe(200)
    })

    test('Dashboard Access', async () => {
        const res = await request(app).get('/api/dashboard')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res.status).toBe(200)
        expect(res.body).toHaveProperty('global')
        expect(res.body).toHaveProperty('inventario')
    })
    
    test('User Management & Errors', async () => {
        const resGet = await request(app).get('/api/usuario')
            .set('Authorization', `Bearer ${adminToken}`)
        expect(resGet.status).toBe(200)
        expect(resGet.body.length).toBeGreaterThan(0)
        
        const userId = resGet.body[0]._id
        const resUpdate = await request(app).patch(`/api/usuario/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ nombre: 'Editado' })
        expect(resUpdate.status).toBe(200)

        // Delete user
        const resDel = await request(app).delete(`/api/usuario/${userId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(resDel.status).toBe(200)

        // Test error 404 (ID no existe)
        const fakeId = new mongoose.Types.ObjectId()
        const res404 = await request(app).get(`/api/usuario/${fakeId}`)
            .set('Authorization', `Bearer ${adminToken}`)
        expect(res404.status).toBe(404)
    })
})
