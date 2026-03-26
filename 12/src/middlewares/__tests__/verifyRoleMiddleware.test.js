import { jest } from '@jest/globals'
import { verifyRoleMiddleware } from '../verifyRoleMiddleware.js'

describe('verifyRoleMiddleware Unit Tests (Isolation)', () => {
    // Definimos las variables que simulan los parametros de Express (req, res, next)
    let req, res, next;

    beforeEach(() => {
        // ARRANGE: Preparamos un mock de la peticion (req) con un usuario y rol
        req = {
            user: {
                role: 'CUSTOMER'
            }
        };
        // Para mockear un objeto que tiene metodos encadenados como res.status().json()
        // usamos .mockReturnThis() para que al llamar a status() devuelva el mismo objeto res
        // Si no lo hicieramos, res.status() devolveria undefined y el test romperia al intentar llamar a .json()
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        // next es solo una funcion que Jest debe rastrear si fue llamada o no
        next = jest.fn();
    });

    it('should call next if role is allowed', () => {
        // Configuramos el middleware para que acepte CUSTOMER
        const middleware = verifyRoleMiddleware(['CUSTOMER', 'ADMIN']);
        
        // ACT: Ejecutamos el middleware manualmente
        middleware(req, res, next);
        
        // ASSERT: Como el rol es correcto, debe llamar a next() y no devolver error
        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 if role is not allowed', () => {
        // Configuramos el middleware para que SOLO acepte ADMIN
        const middleware = verifyRoleMiddleware(['ADMIN']);
        
        middleware(req, res, next);
        
        // ASSERT: Como el rol es CUSTOMER, no debe llamar a next() y debe devolver 403
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should return 401 if user is not in request', () => {
        // Simulamos el caso donde el payload del token no llego al request
        req.user = undefined;
        const middleware = verifyRoleMiddleware(['ADMIN']);
        middleware(req, res, next);
        
        expect(next).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(401);
    });
})
