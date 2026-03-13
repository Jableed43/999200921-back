import { checkModelExist } from "../helpers/checkExist.js"
import Product from "../models/productModel.js"

export const createProductService = async (productData) => {
    const {name} = productData
    const exist = await checkModelExist(Product, {name}, false, null, `Product ${name} already exists`)
    console.log({exist})
    if(exist){
        throw {message: "El producto ya existe", statusCode: 400}
    }

    // creo instancia del producto
    const newProduct = new Product(productData)
    console.log({newProduct})
    // guardo el producto
    const savedProduct = await newProduct.save()
    console.log({savedProduct})
    return savedProduct
}

export const getAllProductService = async () => {
    //populate("category") hace un llamado a la categoria por el id de cada producto
    const products = await Product.find().populate({ path: "category", select: "name" })     
    console.log({products})
    return products
}

export const updateProductService = async (id, productData) => {
    await checkModelExist(Product, {_id: id}, true, 404, "Product not found")

    // findByIdAndUpdate tiene 3 parametros
    // 1. Es el id
    // 2. Es la informacion con la que vas a actualizar el registro
    // 3. returnDocument -> retorna el documento luego de la actualizacion
    const updateProduct = await Product.findByIdAndUpdate(
        {_id: id},
        productData,
        { returnDocument: "after" }
    )

    return updateProduct
}

export const deleteProductService = async (id) => {
    await checkModelExist(Product, {_id: id}, true, 404, "Product not found")

    const deleted = await Product.findByIdAndDelete(id)

    return { message: "Product deleted succesfully", data: deleted }
}

export const getProductByIdService = async (id) => {
    
    const product = await checkModelExist(Product, {_id: id}, true, 404, "Product not found")

    return product
}