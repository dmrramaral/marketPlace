const express = require('express');
const router = express.Router();
const User = require('../model/User');
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');



//Rota para criar um usuário
router.post('/create', validationMiddleware.validaUser, userController.createUserController(User));

//Rota para adicionar um produto aos favoritos do usuário
router.post('/:id/favorites',validationMiddleware.validaIdParam, userController.addFavoriteProductController(User));

//Rota para  inserir endereço ao usuário
router.post('/:id/address',validationMiddleware.validaIdParam, validationMiddleware.validAddresses ,userController.createAddressController());

//Routas para buscar todos os usuários
router.get('/',authMiddleware, userController.getAllUsersController(User));

// Rota para buscar um usuário por ID
router.get('/:id',authMiddleware, userController.findByIdController(User) );

// Rota para atualizar um usuário por ID
router.put('/:id',authMiddleware,validationMiddleware.validaIdParam,validationMiddleware.validaUser, userController.updateUserController(User));

// Rota para deletar um usuário por ID
router.delete('/:id',authMiddleware,validationMiddleware.validaIdParam, userController.deleteUserController(User));

// Rota para remover um produto dos favoritos do usuário
router.delete('/:id/favorites',authMiddleware,validationMiddleware.validaIdParam, userController.deleteFavoriteProductController(User));



module.exports = router;
