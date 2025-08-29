const authService = require('../service/auth.service');
const bcrypt = require('bcrypt');

const loginController = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await authService.loginService(email);
        if (!user) {
            return res.status(404).json({ message: 'Senha ou Usuário incorreto' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Senha ou Usuário incorreto' });
        }
        const token = authService.generateTokenService(user);
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erro no servidor', error: error.message });
    }
};


module.exports = { loginController };