module.exports = (req, res, next) => {
    let { page, limit } = req.query;

    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (!page || page < 1) page = 1;
    if (!limit || limit < 1 || limit > 100) limit = 10; // proteção simples

    const skip = (page - 1) * limit;

    req.pagination = { page, limit, skip };
    next();
};