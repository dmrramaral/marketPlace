const Product = require('../model/Product');
const Category = require('../model/Category');

const createProductService = async (productData) => {
    if (!productData?.name || !productData?.description || !productData?.price || !productData?.category || productData?.stock === undefined) {
        throw new Error('Dados do produto incompletos');
    }

    // Normalizar categoria: aceita string ou array
    let categoryArray = productData.category;
    if (typeof productData.category === 'string') {
        categoryArray = [{ _id: productData.category }];
    } else if (!Array.isArray(productData.category)) {
        throw new Error('Categoria inválida');
    } else if (productData.category.length === 0) {
        throw new Error('Categoria inválida');
    }

    // Verificar se todas as categorias existem
    for (const cat of categoryArray) {
        const catId = cat._id || cat;
        const exists = await Category.findById(catId);
        if (!exists) {
            throw new Error(`Categoria inválida: ${catId}`);
        }
    }

    // Normalizar imagens: aceita string ou array
    let imagesArray = productData.images;
    if (productData.image && !productData.images) {
        // Se enviou 'image' ao invés de 'images'
        imagesArray = [productData.image];
    } else if (typeof productData.images === 'string') {
        imagesArray = [productData.images];
    }

    const newProduct = new Product({
        ...productData,
        category: categoryArray,
        images: imagesArray
    });
    
    const savedProduct = await newProduct.save();
    const productObj = savedProduct.toObject();
    
    // Popular categorias
    if (productObj.category && productObj.category.length > 0) {
        const categoryIds = productObj.category.map(c => c._id);
        const categories = await Category.find({ _id: { $in: categoryIds } });
        
        // Pegar a primeira categoria como categoria principal
        productObj.category = categories[0] || null;
    } else {
        productObj.category = null;
    }
    
    // Normalizar imagem (pegar a primeira do array)
    if (productObj.images && productObj.images.length > 0) {
        productObj.image = productObj.images[0];
    }
    
    return productObj;
}

const getAllProductsService = async ({ page = 1, limit = 10, skip = 0, category } = {}) => {
    const query = {};
    if (category) {
        // Campo category é um array de objetos com _id
        query['category._id'] = category;
    }

    const [productsRaw, total] = await Promise.all([
        Product.find(query)
            .skip(skip)
            .limit(limit)
            .populate('reviews.user', 'name email'),
        Product.countDocuments(query)
    ]);

    // Popular manualmente as categorias e normalizar para o frontend
    const Category = require('../model/Category');
    const products = await Promise.all(productsRaw.map(async (product) => {
        const productObj = product.toObject();
        
        // Popular categorias
        if (productObj.category && productObj.category.length > 0) {
            const categoryIds = productObj.category.map(c => c._id);
            const categories = await Category.find({ _id: { $in: categoryIds } });
            
            // Pegar a primeira categoria como categoria principal
            productObj.category = categories[0] || null;
        } else {
            productObj.category = null;
        }
        
        // Normalizar imagem (pegar a primeira do array)
        if (productObj.images && productObj.images.length > 0) {
            productObj.image = productObj.images[0];
        }
        
        return productObj;
    }));

    const totalPages = Math.ceil(total / limit) || 1;

    return { products, page, limit, total, totalPages, category: category || null };
}

const findProductByIdService = async (id) => {
    if (!id) {
        throw new Error('ID do produto é obrigatório');
    }
    
    const product = await Product.findById(id).populate('reviews.user', 'name email');
    if (!product) {
        throw new Error('Produto não encontrado');
    }
    
    const productObj = product.toObject();
    
    // Popular categorias
    if (productObj.category && productObj.category.length > 0) {
        const Category = require('../model/Category');
        const categoryIds = productObj.category.map(c => c._id);
        const categories = await Category.find({ _id: { $in: categoryIds } });
        
        // Pegar a primeira categoria como categoria principal
        productObj.category = categories[0] || null;
    } else {
        productObj.category = null;
    }
    
    // Normalizar imagem (pegar a primeira do array)
    if (productObj.images && productObj.images.length > 0) {
        productObj.image = productObj.images[0];
    }
    
    return productObj;
}

const updateProductService = async (id, productData) => {
    if (!id || !productData) {
        throw new Error('ID e dados do produto são obrigatórios');
    }

    console.log('🔧 Service updateProduct - dados recebidos:', productData);

    // Normalizar categoria se fornecida
    if (productData.category) {
        if (typeof productData.category === 'string') {
            productData.category = [{ _id: productData.category }];
        }
    }

    // Normalizar imagens se fornecidas
    if (productData.image && !productData.images) {
        console.log('🖼️ Convertendo image para images array:', productData.image);
        productData.images = [productData.image];
        delete productData.image;
    } else if (typeof productData.images === 'string') {
        productData.images = [productData.images];
    }

    console.log('🔧 Service updateProduct - dados após normalização:', productData);

    const updatedProduct = await Product.findByIdAndUpdate(id, productData, { new: true });
    
    if (!updatedProduct) {
        throw new Error('Produto não encontrado');
    }
    
    console.log('💾 Produto salvo no banco:', updatedProduct.toObject());
    
    const productObj = updatedProduct.toObject();
    
    // Popular categorias
    if (productObj.category && productObj.category.length > 0) {
        const categoryIds = productObj.category.map(c => c._id);
        const categories = await Category.find({ _id: { $in: categoryIds } });
        
        // Pegar a primeira categoria como categoria principal
        productObj.category = categories[0] || null;
    } else {
        productObj.category = null;
    }
    
    // Normalizar imagem (pegar a primeira do array)
    if (productObj.images && productObj.images.length > 0) {
        productObj.image = productObj.images[0];
    }
    
    console.log('✅ Service updateProduct - retornando:', productObj);
    
    return productObj;
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