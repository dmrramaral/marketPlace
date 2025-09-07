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




module.exports = { validaUser,
    validProduct
 };