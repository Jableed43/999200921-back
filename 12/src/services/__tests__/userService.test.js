import {describe, jest} from '@jest/globals'
import { validateUserService } from '../userService'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { checkModelExist } from '../../helpers/checkExist'

//1. Mock de las dependencias: reemplazamos los modulos reales por versiones falsas controladas
jest.mock('../../models/userModel.js')
jest.mock('bcrypt')
jest.mock('jsonwebtoken')
jest.mock('../../helpers/checkExist.js', () => ({
    checkModelExist: jest.fn()
}))

// Suite de testing -> es un conjunto de tests
// dentro del describe colocamos todos los tests
describe('userService unit tests', () => {
    // Despues de cada test limpia todos los mocks anteriores para que no arrasten informacion
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('validateUserService', () => {
        // Las pruebas se inician con "it"
        it('should throw error if email or password are missing', async () => {
            // Escenario el usuario manda un objeto incompleto
            await expect(validateUserService({email: 'test@test.com'}))
                .rejects.toThrow("There's a missing field")
        })

        // Deberia logearse y retornar el token si las credenciales son correctas
        it('should login and return token if credentials are correct', async () => {
            // Arrange: preparamos los datos y comportamiento del mock
            const mockUser = {
                _id: "123",
                email: "test@test.com",
                password: 'hashedPassword',
                role: 'CUSTOMER'
            }

            // Simular que el usuario existe en la DB, que la pass coincide y que se genere el token
            checkModelExist.mockResolvedValue(mockUser)
            bcrypt.compareSync.mockReturnValue(true)
            jwt.sign.mockReturnValue('mockToken')

            //ACT: ejecutamos el servicio
            const result = await validateUserService({
                email: 'test@test.com',
                password: "password123"
            })

            // ASSERT: verificamos que el resultado sea el esperado
            // toEqual se usa para datos tipo objeto y array
            expect(result).toEqual({
                message: 'Logged In',
                token: 'mockToken'
            })

            // Verifica que se haya llamado a la funcion de firma del token
            expect(jwt.sign).toHaveBeenCalled()
        })

        it('should throw error if password is incorrect', async () => {
            //arrange: escribimos el usuario
             const mockUser = {
                _id: "123",
                email: "test@test.com",
                password: 'hashedPassword',
                role: 'CUSTOMER'
            }

            // Estos dos condicionan la respuesta dentro del validateUserService
            checkModelExist.mockResolvedValue(mockUser)
            bcrypt.compareSync.mockReturnValue(false)

            //act y assert
            await expect(validateUserService({
                email: 'test@test.com',
                password: 'wrongPassword'
            })).rejects.toThrow("User or password are incorrect")
        })
    })
})