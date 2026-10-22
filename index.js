require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');

const httpStatusText = require('./utils/httpStatusText');

const app = express();

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const url = process.env.MONGO_URL;
if (!url) {
    console.error('MONGO_URL is missing. Create a .env file .');
    process.exit(1);
}

mongoose
    .connect(url)
    .then(() => console.log('mongodb server started'))
    .catch((err) => {
        console.error('mongodb connection failed:', err.message);
        process.exit(1);
    });

app.use(cors());
app.use(express.json());

const coursesRouter = require('./routes/courses.route');
const usersRouter = require('./routes/users.route');

app.use('/api/courses', coursesRouter); // /api/courses
app.use('/api/users', usersRouter);     // /api/users

// global middleware for not found routes
// (Express 5 no longer accepts app.all('*'); a path-less app.use catches everything)
app.use((req, res) => {
    return res.status(404).json({ status: httpStatusText.ERROR, message: 'this resource is not available' });
});

// global error handler
app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
        status: error.statusText || httpStatusText.ERROR,
        message: error.message,
        code: error.statusCode || 500,
        data: null,
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`listening on port: ${PORT}`);
});
