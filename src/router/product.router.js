const express = require("express");
const router = express.Router();
const Product = require('../model/Product');


// Rota para criar um produto
router.post('/products/create', async (req, res) => {
    try {
        const { name, description, price, category, brand, sizes, colors, stock, images } = req.body;
        const newProduct = new Product({ name, description, price, category, brand, sizes, colors, stock, images });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Rota para buscar todos os produtos
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para buscar um produto por ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Rota para atualizar um produto por ID
router.put('/products/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json(updatedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    } 
});

// Rota para deletar um produto por ID
router.delete('/products/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }
        res.json({ message: 'Produto deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;