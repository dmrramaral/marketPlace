const User = require('../model/User');
const jwt = require('jsonwebtoken');


const loginService  = (email) => User.findOne({ email: email }).select('+password');

const generateTokenService = (user) => {
    const payload = { id: user._id, role: user.role || (user.admin ? 'admin' : 'user') };
    const token = jwt.sign(payload, process.env.JWT_SECRET , { expiresIn: '1d' });
    return token;
}
module.exports = { loginService, generateTokenService };