import { jest } from '@jest/globals'
import { getAllCategoryService, deleteCategoryService } from '../categoryService.js'
import Category from '../../models/categoryModel.js'
import Product from '../../models/productModel.js'

// Mockeamos ambos modelos porque al borrar una categoria se actualizan los productos
jest.mock('../../models/categoryModel.js')
jest.mock('../../models/productModel.js')
jest.mock('../../helpers/checkExist.js', () => ({
    checkModelExist: jest.fn()
}))

import { checkModelExist } from '../../helpers/checkExist.js'

describe('categoryService Unit Tests', () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    describe('getAllCategoryService', () => {
        it('should return all categories', async () => {
            const mockCats = [{ name: 'C1' }]
            Category.find.mockResolvedValue(mockCats)
            const result = await getAllCategoryService()
            expect(result).toEqual(mockCats)
        })
    })

    describe('deleteCategoryService', () => {
        it('should delete category and update products', async () => {
            // ARRANGE: Simulamos que la categoria existe y que se borra correctamente
            checkModelExist.mockResolvedValue({ _id: '123' })
            Category.findByIdAndDelete.mockResolvedValue({ _id: '123' })
            Product.updateMany.mockResolvedValue({}) // El "cascade" simulado

            // ACT
            const result = await deleteCategoryService('123')

            // ASSERT
            expect(result.message).toBe("Category deleted successfully")
            // Verificamos que se haya llamado a la actualizacion en cascada de productos
            expect(Product.updateMany).toHaveBeenCalled()
        })
    })
})
