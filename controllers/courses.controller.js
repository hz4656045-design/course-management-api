const { validationResult } = require('express-validator');
const Course = require('../models/course.model');
const httpStatusText = require('../utils/httpStatusText');
const appError = require('../utils/appError');

const getAllCourses = async (req, res) => {
    const limit = parseInt(req.query.limit) || 10;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const courses = await Course.find({}, { __v: false }).limit(limit).skip(skip);
    res.json({ status: httpStatusText.SUCCESS, data: { courses } });
};

const getCourse = async (req, res, next) => {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
        return next(appError.create('course not found', 404, httpStatusText.FAIL));
    }
    res.json({ status: httpStatusText.SUCCESS, data: { course } });
};

const addCourse = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(appError.create(errors.array(), 400, httpStatusText.FAIL));
    }

    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json({ status: httpStatusText.SUCCESS, data: { course: newCourse } });
};

const updateCourse = async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(
        req.params.courseId,
        { $set: req.body },
        { new: true, runValidators: true }
    );
    if (!course) {
        return next(appError.create('course not found', 404, httpStatusText.FAIL));
    }
    res.json({ status: httpStatusText.SUCCESS, data: { course } });
};

const deleteCourse = async (req, res, next) => {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) {
        return next(appError.create('course not found', 404, httpStatusText.FAIL));
    }
    res.json({ status: httpStatusText.SUCCESS, data: null });
};

module.exports = { getAllCourses, getCourse, addCourse, updateCourse, deleteCourse };
