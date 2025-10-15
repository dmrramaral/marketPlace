const validaUser = (req, res, next) => {
 let errors = [];
    const { name, email, password, admin } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Name is required and must be a non-empty string.');
    }
    if (!email || typeof email !== 'string' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        errors.push('A valid email is required.');
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
        errors.push('Password is required and must be at least 6 characters long.');
    }
    if (admin !== undefined && typeof admin !== 'boolean') {
        errors.push('Admin must be a boolean value.');
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

// Middleware para validação de atualização de usuário (campos opcionais)
const validaUpdateUser = (req, res, next) => {
    console.log('🔍 validaUpdateUser - Validando body:', req.body);
    let errors = [];
    const { name, email, password, admin, role } = req.body;
    
    // Validações apenas se os campos forem enviados
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
        errors.push('Name must be a non-empty string.');
    }
    if (email !== undefined && (typeof email !== 'string' || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))) {
        errors.push('Email must be valid.');
    }
    if (password !== undefined && (typeof password !== 'string' || password.length < 6)) {
        errors.push('Password must be at least 6 characters long.');
    }
    if (admin !== undefined && typeof admin !== 'boolean') {
        errors.push('Admin must be a boolean value.');
    }
    if (role !== undefined && !['admin', 'user', 'manager'].includes(role)) {
        errors.push('Role must be one of: admin, user, manager.');
    }
    
    if (errors.length > 0) {
        console.log('❌ validaUpdateUser - Erros encontrados:', errors);
        return res.status(400).json({ errors });
    }
    
    console.log('✅ validaUpdateUser - Validação passou');
    next();
};

const  validProduct = (req, res, next) => {
    let errors = [];
    const { name, description, price, stock } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
        errors.push('Name is required and must be a non-empty string.');
    }
    if (!description || typeof description !== 'string' || description.trim().length === 0) {
        errors.push('Description is required and must be a non-empty string.');
    }
    if (price === undefined || typeof price !== 'number' || price < 0) {
        errors.push('Price is required and must be a non-negative number.');
    }
    if (stock === undefined || typeof stock !== 'number' || stock < 0) {
        errors.push('Stock is required and must be a non-negative number.');
    }
    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }
    next();
};

const validAddresses = (req, res, next) => {
    const { addresses } = req.body;
    if (!Array.isArray(addresses) || addresses.length === 0) {
        return res.status(400).json({ error: 'É obrigatório enviar pelo menos um endereço.' });
    }
    const requiredFields = ['street', 'city', 'state', 'zipCode', 'country'];
    const errors = addresses.map((address, idx) => {
        const missing = requiredFields.filter(field => !address[field]);
        return missing.length > 0 ? { index: idx, missingFields: missing } : null;
    }).filter(Boolean);
    if (errors.length > 0) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando em um ou mais endereços.', details: errors });
    }
    next();
};

const validaIdParam = (req, res, next) => {
    const { id } = req.params;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format. Must be a 24-character hex string.' });
    }
    next();
};

const validIdbody = (req, res, next) => {
    const { id } = req.body;
    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
        return res.status(400).json({ error: 'Invalid ID format in body. Must be a 24-character hex string.' });
    }
    next();
};





module.exports = { 
    validaUser,
    validaUpdateUser,
    validProduct,
    validAddresses,
    validaIdParam,
    validIdbody
 };