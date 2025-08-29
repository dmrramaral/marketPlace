const User = require('../model/User');
const jwt = require('jsonwebtoken');


const loginService  = (email) => User.findOne({ email: email }).select('+password');

const generateTokenService = (user) => {
    const token = jwt.sign({ id: user._id, admin: user.admin }, process.env.JWT_SECRET , { expiresIn: '1d' });
    return token;
}
module.exports = { loginService, generateTokenService };