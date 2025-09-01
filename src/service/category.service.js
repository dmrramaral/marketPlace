const Category = require('../model/Category');

const createCategoryService = async (categoryData) => {
    if (!categoryData?.name) {
        throw new Error('Dados da categoria incompletos');
    }

    if ( await Category.findOne({ name: categoryData.name })
    ) {
        throw new Error('Categoria já cadastrada');
    }

    const newCategory = new Category(categoryData);
    return await newCategory.save();
}   

const getAllCategoriesService = async () => {
    return await Category.find();
}

const findCategoryByIdService = async (id) => {
    if (!id) {
        throw new Error('ID da categoria é obrigatório');
    }
    const category = await Category.findById(id);
    if (!category) {
        throw new Error('Categoria não encontrada');
    }
    return category;
}

const updateCategoryService = async (id, categoryData) => {
    if (!id || !categoryData) {
        throw new Error('ID e dados da categoria são obrigatórios');
    }
    const updatedCategory = await Category.findByIdAndUpdate(id, categoryData, { new: true });
    if (!updatedCategory) {
        throw new Error('Categoria não encontrada');
    }
    return updatedCategory;
}

const deleteCategoryService = async (id) => {
    if (!id) {
        throw new Error('ID da categoria é obrigatório');
    }
    const deletedCategory = await Category.findByIdAndDelete(id);
    if (!deletedCategory) {
        throw new Error('Categoria não encontrada');
    }
    return deletedCategory;
}



module.exports = { createCategoryService, getAllCategoriesService, findCategoryByIdService, updateCategoryService, deleteCategoryService };