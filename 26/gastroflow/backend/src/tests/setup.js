import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'

let mongoServer

// Antes de todos los tests, arrancamos el MongoDB en memoria como Replica Set (necesario para transacciones)
beforeAll(async () => {
    // Para versiones recientes de mongodb-memory-server, replSet debe ir con opciones específicas
    mongoServer = await MongoMemoryServer.create({
        instance: {
            storageEngine: 'wiredTiger',
        },
        replSet: {
            count: 1,
            name: 'rs0',
            storageEngine: 'wiredTiger',
        }
    })
    const uri = mongoServer.getUri()
    await mongoose.connect(uri)
}, 60000)

// Después de todos los tests, desconectamos y paramos el servidor
afterAll(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
})

// Limpiamos las colecciones entre tests para asegurar aislamiento
afterEach(async () => {
    const collections = mongoose.connection.collections
    for (const key in collections) {
        const collection = collections[key]
        await collection.deleteMany()
    }
})
