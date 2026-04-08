import request from 'supertest'
import app from '../../index.js'
import Usuario, { roleEnum } from '../models/usuarioModel.js'
import mongoose from 'mongoose'

describe('Edge Cases & Error Handling', () => {
    const getAdminToken = async () => {
        const id = Math.random().toString(36).substring(7)
        const password = 'Password123'
        const email = `admin_${id}@test.com`
        await Usuario.create({
            nombre: 'Admin', apellido: 'Edge', email, 
            password, role: roleEnum[0] // ADMIN
        })
        const login = await request(app).post('/api/usuario/login').send({
            email, password
        })
        return login.body.token
    }

    const getMozoToken = async () => {
        const id = Math.random().toString(36).substring(7)
        const password = 'Password123'
        const email = `mozo_${id}@test.com`
        await Usuario.create({
            nombre: 'Juan', apellido: 'Mozo', email, 
            password, role: roleEnum[2] // MOZO
        })
        const login = await request(app).post('/api/usuario/login').send({
            email, password
        })
        return login.body.token
    }

    test('400: Comanda vacía', async () => {
        const token = await getMozoToken()
        const res = await request(app).post('/api/venta')
            .set('Authorization', `Bearer ${token}`)
            .send({ items: [] })
        expect(res.status).toBe(400)
    })

    test('403: Mozo intenta crear insumo', async () => {
        const token = await getMozoToken()
        const res = await request(app).post('/api/insumo')
            .set('Authorization', `Bearer ${token}`)
            .send({ nombre: 'X' })
        expect(res.status).toBe(403)
    })

    test('404: Insumo inexistente', async () => {
        const token = await getAdminToken()
        const fakeId = new mongoose.Types.ObjectId()
        const res = await request(app).get(`/api/insumo/${fakeId}`)
            .set('Authorization', `Bearer ${token}`)
        // Si falla, imprimimos el error para depurar
        if (res.status !== 404) {
            console.log('STATUS:', res.status, 'BODY:', res.body)
        }
        expect(res.status).toBe(404)
    })

    test('404: Producto inexistente', async () => {
        const token = await getAdminToken()
        const fakeId = new mongoose.Types.ObjectId()
        const res = await request(app).get(`/api/producto/${fakeId}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
    })

    test('404: Venta inexistente', async () => {
        const token = await getAdminToken()
        const fakeId = new mongoose.Types.ObjectId()
        const res = await request(app).patch(`/api/venta/${fakeId}/listo`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.status).toBe(404)
    })
})
