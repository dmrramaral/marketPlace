const jwt  = require('jsonwebtoken');
const findByIdService = require('../service/user.service').findByIdService;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Token não fornecido' });
    }
    const token = authHeader.split(" ");
  
    if(token.length !== 2){
        return res.status(401).json({ message: 'Token mal formatado' });
    }
    const [scheme, credentials] = token;
    if(!/^Bearer$/i.test(scheme)){
        return res.status(401).json({ message: 'Token mal formatado' });
    }

    try {
        jwt.verify(credentials, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(500).json({ message: 'Token inválido', error: err.message });
            }
            // Calcular tempo restante de validade do token
            if (decoded && decoded.exp) {
                const now = Math.floor(Date.now() / 1000);
                const timeLeft = decoded.exp - now;
                console.log(`Tempo restante do token: ${timeLeft} segundos`);
            }

            const user = await findByIdService(decoded.id);
           
            if (!user) {
                return res.status(401).json({ message: 'Token inválido' });
            }

            req.user = decoded;
            return next();
        });
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido', error: error.message });
    }
}
module.exports = authMiddleware;