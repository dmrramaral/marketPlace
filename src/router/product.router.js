const express = require("express");
const router = express.Router();
const productController = require("../controller/product.controller");
const authMiddleware = require("../middleware/auth.middleware");
const {validProduct} = require("../middleware/validation.middleware");
const paginationMiddleware = require("../middleware/pagination.middleware");

// Rota para criar um produto
router.post("/products/create", authMiddleware ,validProduct, productController.createProductController());

// Rota para buscar todos os produtos
router.get("/products", paginationMiddleware, productController.getAllProductsController());

// Rota para buscar um produto por ID
router.get("/products/:id", productController.getProductByIdController());

// Rota para atualizar um produto por ID
router.put("/products/:id",authMiddleware ,validProduct, productController.updateProductController());

// Rota para deletar um produto por ID
router.delete("/products/:id", authMiddleware , productController.deleteProductController());

module.exports = router;    