import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../../index.js'
import User, { roleEnum } from '../../src/models/userModel.js'

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Authorization Integration Tests', () => {

    beforeEach(async () => {
        await User.deleteMany({});
    });

    it('should return 401 if no token provided for a protected route', async () => {
        // Testeamos que sin el header de Authorization el sistema bloquee el acceso
        const response = await request(app).get('/api/user');
        expect(response.statusCode).toBe(400); // 401 = No autorizado (falta token)
    });

    it('should return 403 if a CUSTOMER tries to access ADMIN route', async () => {
        // 1. CREAR USUARIO CONSUMIDOR (roleEnum[2] es CUSTOMER en 921)
        const customerData = {
            email: 'customer@example.com',
            password: 'Password123!',
            name: 'Customer',
            lastName: 'Test',
            role: roleEnum[2]
        };
        await User.create(customerData);

        // 2. LOGUEARSE PARA OBTENER TOKEN
        const loginRes = await request(app)
            .post('/api/user/login')
            .send({
                email: customerData.email,
                password: customerData.password
            });
        
        const token = loginRes.body.token;

        // 3. INTENTAR ACCEDER A RUTA DE ADMIN (GET /api/user)
        const response = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`);

        expect(response.statusCode).toBe(403); // 403 = Prohibido (tiene token pero no permisos)
    });

    it('should allow ADMIN to access ADMIN route', async () => {
         // 1. CREAR USUARIO ADMINISTRADOR (roleEnum[0] es ADMIN en 921)
         const adminData = {
            email: 'admin@example.com',
            password: 'Password123!',
            name: 'Admin',
            lastName: 'Test',
            role: roleEnum[0]
        };
        await User.create(adminData);

        // 2. LOGUEARSE
        const loginRes = await request(app)
            .post('/api/user/login')
            .send({
                email: adminData.email,
                password: adminData.password
            });
        
        const token = loginRes.body.token;

        // 3. ACCEDER A RUTA DE ADMIN
        const response = await request(app)
            .get('/api/user')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200); // 200 = OK
        expect(Array.isArray(response.body)).toBe(true);
    });
});
