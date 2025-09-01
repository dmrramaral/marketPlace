const express = require('express');
const router = express.Router();
const User = require('../model/User');
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');



//Rota para criar um usuário
router.post('/create', userController.createUserController(User));

//Rota para adicionar um produto aos favoritos do usuário
router.post('/:id/favorites', userController.addFavoriteProductController(User));


//Routas para buscar todos os usuários
router.get('/', userController.getAllUsersController(User));


// Rota para buscar um usuário por ID
router.get('/:id',authMiddleware, userController.findByIdController(User) );

// Rota para atualizar um usuário por ID
router.put('/:id', userController.updateUserController(User));

// Rota para deletar um usuário por ID
router.delete('/:id', userController.deleteUserController(User));

// Rota para remover um produto dos favoritos do usuário
router.delete('/:id/favorites', userController.deleteFavoriteProductController(User));



module.exports = router;
