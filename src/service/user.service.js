const User = require("../model/User");

const findByIdService = async (id) => {
    if (!id) {
        throw new Error('ID do usuário é obrigatório');
    }
    const user = await User.findById(id);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    return user;
}

const createUserService = async (userData) => {
    if (!userData || !userData.name || !userData.email) {
        throw new Error('Dados do usuário incompletos');
    }

    if (await User.findOne({ email: userData.email })) {
        throw new Error('Email já cadastrado');
    }
    
    const newUser = new User(userData);
    return await newUser.save();
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
    if (!user.favorites.includes(productId)) {
        user.favorites.push(productId);
        await user.save();
    }
    return user;
}

const deleteFavoriteProductService = async (userId, productId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    user.favorites = user.favorites.filter(fav => fav.toString() !== productId);
    await user.save();
    return user;
}

const getAllUsersService = async () => {
    return await User.find();
}

const createAddressService = async (userId, addressData) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new Error('Usuário não encontrado');
    }
    user.addresses.push(addressData);
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