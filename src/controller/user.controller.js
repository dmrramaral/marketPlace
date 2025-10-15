const userService = require('../service/user.service');

//Buscar usuário por ID
const findByIdController = () => async (req, res) => {
    try {
        const user = await userService.findByIdService(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ error: 'ID inválido' });
        }
        
        res.status(500).json({ error: error.message });
    }
};  

//Criar novo usuário
const createUserController = () => async (req, res) => {
    try {
        const { name, email, password, image, addresses, admin, role } = req.body;
        // Validacaoes basicas
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
        }
        
        // Validacao avancada  de  senha
        if (password.length < 6) {
            return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres' });
        }
        if (!/[A-Z]/.test(password)) {
            return res.status(400).json({ error: 'A senha deve conter pelo menos uma letra maiúscula' });
        }
        if (!/[a-z]/.test(password)) {
            return res.status(400).json({ error: 'A senha deve conter pelo menos uma letra minúscula' });
        }
            if (!/\d/.test(password)) {
            return res.status(400).json({ error: 'A senha deve conter pelo menos um número' });
        }
        if (!/[!@#$%^&*]/.test(password)) {
            return res.status(400).json({ error: 'A senha deve conter pelo menos um caractere especial (!@#$%^&*)' });
        }
        // Criar o usuário
    // Força default seguro da role se valor inválido / ausente
    const normalizedRole = ['admin', 'user', 'manager'].includes(role) ? role : 'user';
    const newUser = await userService.createUserService({ name, email, password, image, addresses, admin, role: normalizedRole });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Atualizar usuário por ID
const updateUserController = () => async (req, res) => {
    try {
        console.log('📥 Recebendo requisição PUT /user/:id');
        console.log('   User ID:', req.params.id);
        console.log('   Body:', req.body);
        
        const { name, email, password, image, addresses, admin, role } = req.body;

        // Validação básica
        if (!name && !email && !password && !image && !addresses && admin === undefined && !role) {
            console.log('❌ Validação falhou: nenhum campo fornecido');
            return res.status(400).json({ error: 'Pelo menos um campo deve ser fornecido para atualização' });
        }

        // Criar updateData apenas com campos que foram fornecidos
        let updateData = {};
        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (password !== undefined) updateData.password = password;
        if (image !== undefined) updateData.image = image;
        if (addresses !== undefined) updateData.addresses = addresses;
        if (admin !== undefined) updateData.admin = admin;
        
        if (role) {
            if (['admin', 'user', 'manager'].includes(role)) {
                updateData.role = role;
                console.log('✅ Role válido:', role);
            } else {
                console.log('❌ Role inválido:', role);
                return res.status(400).json({ error: 'Role inválido. Use: admin, user ou manager' });
            }
        }
        
        console.log('📝 Dados para atualizar:', updateData);
        
        const updatedUser = await userService.updateUserService(req.params.id, updateData);
        if (!updatedUser) {
            console.log('❌ Usuário não encontrado');
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        console.log('✅ Usuário atualizado com sucesso');
        res.json(updatedUser);
    } catch (error) {
        console.error('❌ Erro no updateUserController:', error.message);
        res.status(400).json({ error: error.message });
    } 
};

//Deletar usuário por ID
const deleteUserController = () => async (req, res) => {
    try {
        const deletedUser = await userService.deleteUserService(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Adicionar produto aos favoritos do usuário
const addFavoriteProductController = () => async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await userService.addFavoriteProductService(req.params.id, productId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Buscar todos os usuários
const getAllUsersController = () => async (req, res) => {
    try {
        const users = await userService.getAllUsersService(req.pagination);
        // Retorna no formato esperado pelo frontend
        res.json({ 
            users,
            page: req.pagination.page,
            limit: req.pagination.limit,
            total: users.length
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

//Deletar produto dos favoritos do usuário
const deleteFavoriteProductController = () => async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await userService.deleteFavoriteProductService(req.params.id, productId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Criando enderecos para o usuario
const createAddressController = () => async (req, res) => {
    try {
        // Espera um array de endereços no corpo da requisição
        const { addresses } = req.body;
        const userId = req.params.id;

        if (!Array.isArray(addresses) || addresses.length === 0) {
            return res.status(400).json({ error: 'Endereço inválido. Deve ser um array não vazio.' });
        }

        const updatedUser = await userService.createAddressService(userId, addresses);

        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(updatedUser);

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Delete adresses from user
const deleteAddressController = () => async (req, res) => {
    try {
        const { addressId } = req.body;
        const userId = req.params.id;
        const updatedUser = await userService.deleteAddressService(userId, addressId);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//Buscar perfil do usuário autenticado
const getUserProfileController = () => async (req, res) => {
    try {
        // O middleware de autenticação já disponibiliza req.user com os dados do token
        const userId = req.user.id;
        
        const user = await userService.findByIdService(userId);
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        res.status(200).json({
            message: 'Perfil do usuário recuperado com sucesso',
            user: user
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    findByIdController,
    createUserController,
    updateUserController,
    deleteUserController,
    addFavoriteProductController,
    getAllUsersController,
    deleteFavoriteProductController,
    createAddressController,
    deleteAddressController,
    getUserProfileController
};
