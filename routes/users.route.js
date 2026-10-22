const express = require('express');
const controller = require('../controllers/users.controller');
const { registerValidation } = require('../middleware/validationSchema');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.route('/').get(verifyToken, controller.getAllUsers);
router.route('/register').post(registerValidation(), controller.register);
router.route('/login').post(controller.login);

module.exports = router;
