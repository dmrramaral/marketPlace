const express = require('express');
const router = express.Router();
const User = require('../model/User');
const controller = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');



//Rota para criar um usuário
router.post('/create', controller.createUserController(User));

//Rota para adicionar um produto aos favoritos do usuário
router.post('/:id/favorites', controller.addFavoriteProductController(User));


//Routas para buscar todos os usuários
router.get('/', controller.getAllUsersController(User));


// Rota para buscar um usuário por ID
router.get('/:id',authMiddleware, controller.findByIdController(User) );

// Rota para atualizar um usuário por ID
router.put('/:id', controller.updateUserController(User));

// Rota para deletar um usuário por ID
router.delete('/:id', controller.deleteUserController(User));

// Rota para remover um produto dos favoritos do usuário
router.delete('/:id/favorites', controller.deleteFavoriteProductController(User));



module.exports = router;
