const express = require('express');
const router = express.Router();
const User = require('../model/User');
const userController = require('../controller/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const paginationMiddleware = require('../middleware/pagination.middleware');

/**
 * @swagger
 * tags:
 *   name: User
 *   description: Operações de usuários
 */

//Rota para criar um usuário

/**
 * @swagger
 * /user/create:
 *   post:
 *     summary: Criar um novo usuário
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     zip:
 *                       type: string
 *     responses:
 *       201:
 *         description: "Usuário criado com sucesso"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       400:
 *         description: "Requisição inválida. Campos obrigatórios ausentes ou formato incorreto."
 */
router.post('/create', validationMiddleware.validaUser, userController.createUserController(User));

//Rota para adicionar um produto aos favoritos do usuário
/**
 * @swagger
 * /user/{id}/favorites:
 *   post:
 *     summary: Adicionar um produto aos favoritos do usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: "Produto adicionado aos favoritos com sucesso"
 *       400:
 *         description: "Requisição inválida. Campos obrigatórios ausentes ou formato incorreto (ex: productId faltando)."
 *       404:
 *         description: "Usuário ou produto não encontrado."
 */
router.post('/:id/favorites',validationMiddleware.validaUser,validationMiddleware.validaIdParam, validationMiddleware.validaUser, userController.addFavoriteProductController(User));

//Rota para  inserir endereço ao usuário
/**
 * @swagger
 * /user/{id}/address:
 *   post:
 *     summary: Adicionar um endereço ao usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               addresses:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     street:
 *                       type: string
 *                     city:
 *                       type: string
 *                     state:
 *                       type: string
 *                     zipCode:
 *                       type: string
 *                     country:
 *                       type: string
 *             required:
 *               - addresses
 *     responses:
 *       200:
 *         description: "Endereço adicionado com sucesso"
 *       400:
 *         description: "Requisição inválida. Campos obrigatórios ausentes ou formato incorreto (ex: addresses faltando ou campos obrigatórios dentro de addresses ausentes)."
 *       404:
 *         description: "Usuário não encontrado."
 */
router.post('/:id/address',validationMiddleware.validaIdParam, validationMiddleware.validAddresses, validationMiddleware.validaUser, userController.createAddressController());

//Routas para buscar todos os usuários
/**
 * @swagger
 * /user:
 *   get:
 *     summary: "Buscar todos os usuários"
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página para paginação (padrão é 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Número de itens por página para paginação (padrão é 10)
 *
 *     responses:
 *       200:
 *         description: "Lista de usuários"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: "Não autorizado. Token JWT ausente ou inválido."
 *       500:
 *         description: "Erro ao buscar usuários"
 */ 
router.get('/',authMiddleware,paginationMiddleware, userController.getAllUsersController(User));

// Rota para buscar um usuário por ID
/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Buscar um usuário por ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: "Usuário encontrado"
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: "Não autorizado. Token JWT ausente ou inválido."
 *       404:
 *         description: "Usuário não encontrado"
 */ 
router.get('/:id',authMiddleware, userController.findByIdController(User) );

// Rota para atualizar um usuário por ID
/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Atualizar um usuário por ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: "Usuário atualizado com sucesso"
 *       400:
 *         description: "Requisição inválida. Campos obrigatórios ausentes ou formato inválido."
 *       401:
 *         description: "Não autorizado. Token JWT ausente ou inválido."
 *       404:
 *         description: "Usuário não encontrado"
 */
router.put('/:id',authMiddleware,validationMiddleware.validaIdParam,validationMiddleware.validaUser, userController.updateUserController(User));

// Rota para deletar um usuário por ID
/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Deletar um usuário por ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: "Usuário deletado com sucesso"
 *       401:
 *         description: "Não autorizado. Token JWT ausente ou inválido."
 *       404:
 *         description: "Usuário não encontrado"
 */
router.delete('/:id',authMiddleware,validationMiddleware.validaIdParam, userController.deleteUserController(User));

// Rota para remover um produto dos favoritos do usuário
/**
 * @swagger
 * /user/{id}/favorites:
 *   delete:
 *     summary: Remover um produto dos favoritos do usuário
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *             required:
 *               - productId
 *     responses:
 *       200:
 *         description: "Produto removido dos favoritos com sucesso"
 *       400:
 *         description: "Requisição inválida. Campos obrigatórios ausentes ou formato incorreto (ex: productId faltando)."
 *       401:
 *         description: "Não autorizado. Token JWT ausente ou inválido."
 *       404:
 *         description: "Usuário ou produto não encontrado"
 */
router.delete('/:id/favorites',authMiddleware,validationMiddleware.validaIdParam, userController.deleteFavoriteProductController(User));



module.exports = router;
