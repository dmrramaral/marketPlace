module.exports = (req, res, next) => {
    let { page: offset, limit } = req.query;
    offset = parseInt(offset) || 1;
    limit = parseInt(limit) || 2;
    req.pagination = { offset, limit };
    next();
};