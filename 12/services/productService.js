import Product from "../models/productModel.js"

export const createProductService = async (productData) => {
    // creo instancia del producto
    const newProduct = new Product(productData)
    // guardo el producto
    const savedProduct = await newProduct.save()

    return savedProduct
}