import Product from "../models/productModel.js"

export const createProductService = async (productData) => {
    // creo instancia del producto
    const newProduct = new Product(productData)
    // guardo el producto
    const savedProduct = await newProduct.save()

    return savedProduct
}

export const getAllProductService = async () => {
    //populate("category") hace un llamado a la categoria por el id de cada producto
    const products = await Product.find().populate({ path: "category", select: "name" })
    return products
}

export const updateProductService = async (id, productData) => {
    // directamente acepta el id
    const productExist = await Product.findById(id)
    // especifica el campo de busqueda y ademas podes añadir filtros
    // await Product.findOne({_id: id})
    if(!productExist){
        const error = new Error("Product not found")
        error.statusCode = 404
        throw error
    }

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
    const productExist = await Product.findById(id)

    if(!productExist){
        const error = new Error("Product not found")
        error.statusCode = 404
        throw error
    }

    const deleted = await Product.findByIdAndDelete(id)

    return { message: "Product deleted succesfully", data: deleted }
}