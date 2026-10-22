const jwt = require('jsonwebtoken');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

module.exports = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(appError.create('token is required', 401, httpStatusText.ERROR));
    }

    const token = authHeader.split(' ')[1];
    try {
        req.currentUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        next();
    } catch (err) {
        return next(appError.create('invalid token', 401, httpStatusText.ERROR));
    }
};
