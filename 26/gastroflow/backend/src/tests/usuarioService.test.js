import { createUsuarioService, loginUsuarioService } from '../services/usuarioService.js'
import Usuario from '../models/usuarioModel.js'
import bcrypt from 'bcrypt'

describe('Usuario Service - Autenticación y Perfiles', () => {
    
    test('Debe hashear la contraseña al registrar un usuario', async () => {
        const data = {
            nombre: 'Carlos',
            apellido: 'Admin',
            email: 'admin@test.com',
            password: 'Password123',
            role: 'ADMIN'
        }
        const usuario = await createUsuarioService(data)
        
        expect(usuario.email).toBe('admin@test.com')
        expect(usuario.password).not.toBe('Password123')
        expect(bcrypt.compareSync('Password123', usuario.password)).toBe(true)
    })

    test('Debe permitir el login con credenciales válidas', async () => {
        await createUsuarioService({
            nombre: 'Mozo',
            apellido: 'Test',
            email: 'mozo@test.com',
            password: 'Password123',
            role: 'MOZO'
        })

        const usuario = await loginUsuarioService({
            email: 'mozo@test.com',
            password: 'Password123'
        })

        expect(usuario.nombre).toBe('mozo') // el modelo usa lowercase: true
    })

    test('Debe fallar login con contraseña incorrecta', async () => {
        await createUsuarioService({
            nombre: 'Test',
            apellido: 'User',
            email: 'wrong@test.com',
            password: 'Password123'
        })

        await expect(loginUsuarioService({
            email: 'wrong@test.com',
            password: 'WrongPassword'
        })).rejects.toThrow('Credenciales inválidas')
    })
})
