const User = require("../model/User");

// helper para extrair id como string de forma segura
const idStr = (x) => {
    if (x === null || x === undefined) return '';
    if (typeof x === 'string') return x;
    if (x && x._id) return String(x._id);
    if (x && typeof x.toHexString === 'function') return x.toHexString();
    return String(x);
};

const findByIdService = async (id) => {
    if (!id) {
        throw new Error('ID do usuário é obrigatório');
    }
    const user = await User.findById(id);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    user.password = undefined; // Remover a senha do objeto retornado

    
    return user;
}

const createUserService = async (userData) => {
    if (!userData?.name || !userData?.email) {
        throw new Error('Dados do usuário incompletos');
    }

    if (await User.findOne({ email: userData.email })) {
        throw new Error('Email já cadastrado');
    }

    const newUser = await new User(userData).save();
    // Garante default redundante se algo vier sem role
    if (!newUser.role) {
        newUser.role = 'user';
        await newUser.save();
    }
    newUser.password = undefined;
    return newUser;
    
}

const updateUserService = async (id, userData) => {
    if (!id || !userData) {
        throw new Error('ID e dados do usuário são obrigatórios');
    }
    const updatedUser = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!updatedUser) {
        throw new Error('Usuário não encontrado');
    }
    return updatedUser;
}

const deleteUserService = async (id) => {
    if (!id) {
        throw new Error('ID do usuário é obrigatório');
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
        throw new Error('Usuário não encontrado');
    }
    return deletedUser;
}

const addFavoriteProductService = async (userId, productId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    const pid = idStr(productId);
    if (!user.favoritesProducts.some(f => idStr(f) === pid)) {
        user.favoritesProducts.push({ _id: productId });
        await user.save();
    }
    return user;
}

const deleteFavoriteProductService = async (userId, productId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
        const pid2 = idStr(productId);
        user.favoritesProducts = user.favoritesProducts.filter(fav => idStr(fav) !== pid2);
    await user.save();
    return user;
}

const getAllUsersService = async (pagination) => {
    return await User.find().skip((pagination.page - 1) * pagination.limit).limit(pagination.limit);
}

const createAddressService = async (userId, addressesArray) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    // Adiciona cada endereço individualmente
    addressesArray.forEach(address => user.addresses.push(address));
    await user.save();
    return user;
}

const deleteAddressService = async (userId, addressId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    user.addresses = user.addresses.filter(addr => addr._id.toString() !== addressId);
    await user.save();
    return user;
}

module.exports = {
    findByIdService,
    createUserService,
    updateUserService,
    deleteUserService,
    addFavoriteProductService,
    deleteFavoriteProductService,
    getAllUsersService,
    createAddressService,
    deleteAddressService
};