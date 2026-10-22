const express = require('express');
const controller = require('../controllers/courses.controller');
const { courseValidation } = require('../middleware/validationSchema');
const verifyToken = require('../middleware/verifyToken');

const router = express.Router();

router.route('/')
    .get(controller.getAllCourses)
    .post(verifyToken, courseValidation(), controller.addCourse);

router.route('/:courseId')
    .get(controller.getCourse)
    .patch(verifyToken, controller.updateCourse)
    .delete(verifyToken, controller.deleteCourse);

module.exports = router;
