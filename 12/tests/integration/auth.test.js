import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../../index.js";
import User from "../../src/models/userModel";

//1. Configurar la DB en memoria
// Crea una base de datos real, pero vive en la ram
// permite tests aislados

let mongoServer;

beforeAll(async () => {
  // Iniciamos el servidor de mongoDB en memoria antes de todos los tests
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  // Cerramos conexion y destruimos la base de datos temporal
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Auth integration tests", () => {
  beforeEach(async () => {
    // Limpiamos la coleccion de usuario antes de cada test para evitar colisiones
    await User.deleteMany();
  });

  describe("POST /api/user/register", () => {
    // Deberia Registrar un nuevo usuario exitosamente
    it("should register a new user successfully", async () => {
      // Preparacion
      const userData = {
        email: "test@example.com",
        password: "Password123",
        name: "test user",
        lastName: "doe",
        role: "CUSTOMER",
      };

      //ACT
      const response = await request(app)
        .post("/api/user/register")
        .send(userData);

      // ASSERT
      // el codigo 201 significa created, es para registros nuevos
      expect(response.status).toBe(201);
      // Comparamos el email de la respuesta contra el email del mock de usuario
      expect(response.body.email).toBe(userData.email);

      // Verificamos si el usuario realmente impacto en la base de datos
      const userInDB = await User.findOne({ email: userData.email });

      // .not siempre se puede usar y es la negacion directa de cualquier expect
      // toBeNull busca que el valor sea vacio
      // por lo tanto valida que al buscar el usuario con findOne no sea nulo
      expect(userInDB).not.toBeNull();
    });
  });

  describe("POST /api/user/login", () => {
    // Deberia logear un usuario existente
    it("should login an existing user", async () => {
      const userData = {
        email: "test@example.com",
        password: "Password123",
        name: "test user",
        lastName: "doe",
        role: "CUSTOMER",
      };

      // Registramos el usuario
      await request(app).post("/api/user/register").send(userData);

      // Intentamos loggearnos
      const response = await request(app)
        .post("/api/user/login")
        .send({
            email: userData.email,
            password: userData.password
        })

        expect(response.status).toBe(200)
        // toBeDefined asegura que no sea undefined
        expect(response.body.token).toBeDefined()
        expect(response.body.message).toBe('Logged In')
    });
    // deberia fallar el login con credenciales erroneas
    it('should fail login with wrong credentials', async() => {
        const response = await request(app)
            .post('/api/user/login')
            .send({
                email: 'cualquiera@cualca.com',
                password: 'contraseñaMala'
            })

            expect(response.status).toBe(400)
            expect(response.body.message).toBeDefined()
            console.log(response.body.message)
    })
  });
});
