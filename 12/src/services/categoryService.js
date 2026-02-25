import { checkModelExist } from "../helpers/checkExist.js";
import Category from "../models/categoryModel.js";
import Product from "../models/productModel.js";

export const getAllCategoryService = async () => {
    const categories = await Category.find()
    return categories
}

export const createCategoryService = async (name) => {
   await checkModelExist(Category, name, false, 400, "Category already exists")

   const newCategory = new Category(name)
   const response = await newCategory.save()
   return response
}

export const deleteCategoryService = async (id) => {
    await checkModelExist(Category, {_id: id}, true, 404, "Category not found")

   const deleted = await Category.findByIdAndDelete(id)

   // Funciona como cascade en caso de borrar una categoria que los productos posean
   await Product.updateMany(
  { category: id },
  { $set: { category: null } }
    )

   return deleted
}