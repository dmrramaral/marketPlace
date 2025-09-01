const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");

// Rota para criar um produto
router.post("/products/create", productController.createProductController());

// Rota para buscar todos os produtos
router.get("/products", productController.getAllProductsController());

// Rota para buscar um produto por ID
router.get("/products/:id", productController.getProductByIdController());

// Rota para atualizar um produto por ID
router.put("/products/:id", productController.updateProductController());

// Rota para deletar um produto por ID
// (Implementar se necessário)

module.exports = router;    