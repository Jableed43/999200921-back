import { jest } from '@jest/globals'
import { getAllProductService, getProductByIdService } from '../productService.js'
import Product from '../../models/productModel.js'

// Mockeamos el modelo de Mongoose
jest.mock('../../models/productModel.js')
jest.mock('../../helpers/checkExist.js', () => ({
    checkModelExist: jest.fn()
}))

import { checkModelExist } from '../../helpers/checkExist.js'

describe('productService Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getAllProductService', () => {
        it('should return all products when no query provided', async () => {
            // ARRANGE: Mockeamos la cadena de métodos de Mongoose .find().populate()
            const mockProducts = [{ name: 'P1' }, { name: 'P2' }]
            Product.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProducts)
            })

            // ACT
            const result = await getAllProductService({})

            // ASSERT
            expect(result).toEqual(mockProducts)
            expect(Product.find).toHaveBeenCalledWith({})
        })

        it('should apply filters when query provided', async () => {
            // Testeamos que los filtros del query se transformen correctamente en filtros de MongoDB
            const query = { category: 'electronics', search: 'phone' }
            Product.find.mockReturnValue({
                populate: jest.fn().mockResolvedValue([])
            })

            await getAllProductService(query)

            // Verificamos que se haya construido el filtro $or correctamente (case-insensitive)
            expect(Product.find).toHaveBeenCalledWith({
                category: 'electronics',
                $or: [
                    { name: { $regex: 'phone', $options: 'i' } },
                    { description: { $regex: 'phone', $options: 'i' } }
                ]
            })
        })
    })

    describe('getProductByIdService', () => {
        it('should return product if exists', async () => {
            const mockProduct = { name: 'P1' }
            // Simulamos que el helper de existencia no lanza error
            checkModelExist.mockResolvedValue(mockProduct)
            Product.findById.mockReturnValue({
                populate: jest.fn().mockResolvedValue(mockProduct)
            })

            const result = await getProductByIdService('123')
            expect(result).toEqual(mockProduct)
        })

        it('should throw error if checkModelExist fails', async () => {
            // Simulamos el caso donde el producto NO existe
            checkModelExist.mockRejectedValue(new Error('Product not found'))
            await expect(getProductByIdService('123')).rejects.toThrow('Product not found')
        })
    })
})
