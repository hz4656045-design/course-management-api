const { body } = require('express-validator');

const courseValidation = () => [
    body('title')
        .notEmpty().withMessage('title is required')
        .isLength({ min: 2 }).withMessage('title must be at least 2 characters'),
    body('price')
        .notEmpty().withMessage('price is required')
        .isNumeric().withMessage('price must be a number'),
];

const registerValidation = () => [
    body('firstName').notEmpty().withMessage('firstName is required'),
    body('lastName').notEmpty().withMessage('lastName is required'),
    body('email').isEmail().withMessage('a valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('password must be at least 6 characters'),
];

module.exports = { courseValidation, registerValidation };
