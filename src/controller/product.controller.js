const productService = require('../service/product.service');

//Criar novo produto
const createProductController = () => async (req, res) => {
    try {
        const { name, description, price, category, brand, sizes, colors, stock, images, image, ingredients } = req.body;
        // Validações básicas
        if (!name || !description || !price || !category || !stock) {
            return res.status(400).json({ error: 'Nome, descrição, preço, categoria e estoque são obrigatórios' });
        }
        // Criar o produto
        const newProduct = await productService.createProductService({ name, description, price, category, brand, sizes, colors, stock, images, image, ingredients });
        res.status(201).json(newProduct);
    } catch (error) {
        console.log(error);
         return res.status(400).json({ message: error.message || 'Erro ao criar produto' });
    }
};

//Buscar todos os produtos
const getAllProductsController = () => async (req, res) => {
    try {
        const { category } = req.query;
        const pageData = await productService.getAllProductsService({ ...req.pagination, category });
        res.status(200).json(pageData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Buscar produto por ID
const getProductByIdController = () => async (req, res) => {
    try {
        const product = await productService.findProductByIdService(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

//Atualizar produto por ID
const updateProductController = () => async (req, res) => {
    try {
        const { name, description, price, category, brand, sizes, colors, stock, images, image, ingredients } = req.body;
        
        console.log('📦 Backend recebeu UPDATE:', req.body);
        console.log('🖼️ Image field:', image);
        console.log('🖼️ Images field:', images);

        // Validação básica
        if (!name && !description && !price && !category && !brand && !sizes && !colors && stock === undefined && !images && !image && !ingredients) {
            return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' });
        }

        const updatedProduct = await productService.updateProductService(req.params.id, { name, description, price, category, brand, sizes, colors, stock, images, image, ingredients });
        
        console.log('✅ Produto atualizado:', updatedProduct);
        
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        console.error('❌ Erro ao atualizar:', error);
        res.status(400).json({ error: error.message });
    }
};

//Deletar produto por ID
const deleteProductController = () => async (req, res) => {
    try {
        const deletedProduct = await productService.deleteProductService(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createProductController, 
    getAllProductsController, getProductByIdController, updateProductController, deleteProductController };
