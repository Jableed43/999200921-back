import { jest } from '@jest/globals'
import { createPurchaseService } from '../purchaseService.js'
import Product from '../../models/productModel.js'

// Mockeamos la DB de MongoDB (Product)
jest.mock('../../models/productModel.js')

// 1. MOCKEAR FIREBASE: Evitamos conexiones reales a la red durante los tests
// Usamos una "Factory Function" (f => { ... }) para devolver un objeto 
// que contenga todas las funciones que usa nuestro servicio.
jest.mock('firebase/app', () => ({
    initializeApp: jest.fn().mockReturnValue({})
}))
jest.mock('firebase/firestore', () => ({
    collection: jest.fn(),
    // Mockeamos addDoc para que devuelva una PROMESA resuelta con un ID falso
    addDoc: jest.fn().mockResolvedValue({ id: 'mockPurchaseId' }),
    query: jest.fn(),
    orderBy: jest.fn(),
    getDocs: jest.fn(),
    where: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    getFirestore: jest.fn().mockReturnValue({})
}))

describe('purchaseService Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('createPurchaseService', () => {
        it('should throw error if items are missing or empty', async () => {
            // Validacion de entrada: Array vacio o inexistente
            await expect(createPurchaseService({}))
                .rejects.toThrow("Items array is required and must not be empty")
        })

        it('should create purchase if stock is available', async () => {
            // ARRANGE: Tenemos stock (10) y queremos comprar 2
            const mockProduct = {
                _id: 'p1',
                name: 'Test Product',
                quantity: 10,
                price: 100,
                profitRate: 1.2
            }
            Product.findById.mockResolvedValue(mockProduct)
            Product.findOneAndUpdate.mockResolvedValue({})

            const purchaseData = {
                userId: 'u1',
                items: [{ productId: 'p1', quantity: 2 }]
            }

            // ACT
            const result = await createPurchaseService(purchaseData)

            // ASSERT: El ID devuelto es el del mock de Firebase
            expect(result.id).toBe('mockPurchaseId')
            // El calculo debe ser: (precio * profit) * cantidad -> (100 * 1.2) * 2 = 240
            expect(result.totalAmount).toBe(240)
            // Verificamos que se desconto el stock en MongoDB
            expect(Product.findOneAndUpdate).toHaveBeenCalled()
        })

        it('should throw error if not enough stock', async () => {
            // ARRANGE: Hay stock (1) pero queremos 2
            const mockProduct = {
                _id: 'p1',
                name: 'Test Product',
                quantity: 1,
                price: 100,
                profitRate: 1.2
            }
            Product.findById.mockResolvedValue(mockProduct)

            const purchaseData = {
                userId: 'u1',
                items: [{ productId: 'p1', quantity: 2 }]
            }

            // ASSERT: Debe lanzar error de stock insuficiente
            await expect(createPurchaseService(purchaseData))
                .rejects.toThrow(/Not enough stock/)
        })
    })
})
