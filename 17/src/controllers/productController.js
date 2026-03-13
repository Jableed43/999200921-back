import { getAllCategoryService } from "../services/categoryService.js"
import { createProductService, deleteProductService, getAllProductService, getProductByIdService, updateProductService } from "../services/productService.js"
import { handleError } from "../utils/errorHandler.js"

// vistas
export const getAllProductView = async (req, res) => {
    try {
        const products = await getAllProductService()

        console.log({products})
        res.render("product/getAllProduct", {
            title: "Listado de productos",
            products
        })
    } catch (error) {
        req.session.message = "Error al cargar los productos"
        res.redirect("/")
    }
}

export const createProductView = async (req, res) => {
    try {
        const categories = await getAllCategoryService()
        res.render("product/createProduct", {title: "Nuevo producto", categories})
    } catch (error) {
        req.session.message = "Error al carga la pagina de creacion de producto",
        res.redirect("/")
    }
}


// acciones

export const createProduct = async (req, res) => {
    try {
        const productData = req.body
        console.log({productData})

        productData.highlighted = !!productData.highlighted
        productData.price = Number(productData.price)

        if(productData.category === "" || productData.category === "null") productData.category = null
        const result = await createProductService(productData)
        console.log({productData})
        console.log({result})

        req.session.message = "Producto creado con exito"
        req.session.success = true
        res.redirect("/product/getAll")
    } catch (error) {
        req.session.message = "Error al crear producto", error.message
        res.redirect("/product/create")
    }
}

export const getAllProduct = async (req, res) => {
    try {
        const products = await getAllProductService()
        res.status(200).json(products)
    } catch (error) {
        handleError(error, res)
    }
}

export const updateProduct = async (req, res) => {
    try {
       const { id } = req.params
       const productData = req.body

       const updatedProduct = await updateProductService(id, productData)

       res.status(201).json(updatedProduct)

    } catch (error) {
        handleError(error, res)
    }
}

export const deleteProduct = async (req, res) => {
    try {
    const {id} = req.params
    const response = await deleteProductService(id)
    res.status(201).json(response)
    } catch (error) {
         handleError(error, res)
    }
}

export const getProductById = async (req, res) => {
    try {
        const {id} = req.params
        const product = await getProductByIdService(id)
        res.status(200).json(product)
    } catch (error) {
        handleError(error, res)
    }
}