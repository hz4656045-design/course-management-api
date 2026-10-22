const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const User = require('../models/user.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');
const generateJWT = require('../utils/generateJWT');

// Express 5 forwards rejected promises from async handlers to the error handler.
const getAllUsers = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const users = await User.find({}, { __v: false, password: false }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { users } });
};

const register = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(appError.create(errors.array(), 400, httpStatusText.FAIL));
    }

    const { firstName, lastName, email, password } = req.body;

    const oldUser = await User.findOne({ email });
    if (oldUser) {
        return next(appError.create('user already exists', 400, httpStatusText.FAIL));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, password: hashedPassword });

    newUser.token = generateJWT({ email: newUser.email, id: newUser._id });
    await newUser.save();

    res.status(201).json({
        status: httpStatusText.SUCCESS,
        data: { user: { _id: newUser._id, firstName, lastName, email, token: newUser.token } },
    });
};

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(appError.create('email and password are required', 400, httpStatusText.FAIL));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(appError.create('user not found', 400, httpStatusText.FAIL));
    }

    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
        return next(appError.create('invalid email or password', 400, httpStatusText.FAIL));
    }

    const token = generateJWT({ email: user.email, id: user._id });
    res.json({ status: httpStatusText.SUCCESS, data: { token } });
};

module.exports = { getAllUsers, register, login };
