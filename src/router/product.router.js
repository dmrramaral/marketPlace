const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const authMiddleware = require("../middleware/auth.middleware");

// Rota para criar um produto
router.post("/products/create", authMiddleware , productController.createProductController());

// Rota para buscar todos os produtos
router.get("/products", productController.getAllProductsController());

// Rota para buscar um produto por ID
router.get("/products/:id", productController.getProductByIdController());

// Rota para atualizar um produto por ID
router.put("/products/:id",authMiddleware , productController.updateProductController());

// Rota para deletar um produto por ID
router.delete("/products/:id", authMiddleware , productController.deleteProductController());

module.exports = router;    