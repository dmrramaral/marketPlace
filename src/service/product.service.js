const Product = require('../model/Product');
const Category = require('../model/Category');

const createProductService = async (productData) => {
    if (!productData?.name || !productData?.description || !productData?.price || !productData?.category || !productData?.stock) {
        throw new Error('Dados do produto incompletos');
    }

    // Verificar se todas as categorias existem
    if (!Array.isArray(productData.category) || productData.category.length === 0) {
        throw new Error('Categoria inválida');
    }
    for (const cat of productData.category) {
        const exists = await Category.findById(cat._id);
        if (!exists) {
            throw new Error(`Categoria inválida: ${cat._id}`);
        }
    }

    const newProduct = new Product(productData);
    return await newProduct.save();
}

const getAllProductsService = async () => {
    return await Product.find().populate('category', 'name').populate('reviews.user', 'name email');
}

const findProductByIdService = async (id) => {
    if (!id) {
        throw new Error('ID do produto é obrigatório');
    }
    const product = await Product.findById(id).populate('category', 'name').populate('reviews.user', 'name email');
    if (!product) {
        throw new Error('Produto não encontrado');
    }
    return product;
}

const updateProductService = async (id, productData) => {
    if (!id || !productData) {
        throw new Error('ID e dados do produto são obrigatórios');
    }
    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (!updatedProduct) {
        throw new Error('Produto não encontrado');
    }
    return updatedProduct;
}

const deleteProductService = async (id) => {
    if (!id) {
        throw new Error('ID do produto é obrigatório');
    }
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
        throw new Error('Produto não encontrado');
    }
    return deletedProduct;
}

module.exports = { createProductService, getAllProductsService, findProductByIdService, updateProductService, deleteProductService };