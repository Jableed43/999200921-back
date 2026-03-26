import { isGoodPassword } from "../validators";

describe('Validators Unit Tests', () => {
    describe('isGoodPassword', () => {
        // Retorna true para contraseñas validas
        it('should return true for valid passwords', () => {
            //toBe se usa para datos nativos -> null, undefined, number, boolean, string
            expect(isGoodPassword('Password123')).toBe(true)
            expect(isGoodPassword('A1b2C3')).toBe(true)
        })

        // Retorna false si la contraseña es demasiado corta
        it('should return false if too short', () => {
            expect(isGoodPassword('Pas1')).toBe(false)
        })

        // Retorna false si la contraseña es demasiado larga
        it('should return false if too long', () => {
            expect(isGoodPassword('Password123456789')).toBe(false)
        })

        it('should return false if missing digits', () => {
            expect(isGoodPassword('Passwordddd')).toBe(false)
        })

        it('should return false if missing uppercase', () => {
            expect(isGoodPassword('password123')).toBe(false)
        })

        it('should return false if missing lowercase', () => {
            expect(isGoodPassword('PASSWORD123')).toBe(false)
        })
    })
})