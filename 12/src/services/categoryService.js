import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

export const getAllCategoryService = async () => {
    const categories = await Category.find()
    return categories
}

export const createCategoryService = async (name) => {
    console.log({name})
   const exist = await Category.findOne(name)

   if(exist){
    const error = new Error("Category already exists")
    error.statusCode = 400
    throw error
   }

   const newCategory = new Category(name)
   const response = await newCategory.save()
   return response
}

export const deleteCategoryService = async (id) => {
    const exist = await Category.findById(id)

    if(!exist){
    const error = new Error("Category not found")
    error.statusCode = 400
    throw error
   }

   const deleted = await Category.findByIdAndDelete(id)

   // Funciona como cascade en caso de borrar una categoria que los productos posean
   await Product.updateMany(
  { category: id },
  { $set: { category: null } }
    )

   return deleted
}