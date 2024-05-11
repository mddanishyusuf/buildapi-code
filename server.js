// server.js
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });

const express = require('express'); // Importing Express framework
const errorHandler = require('./app/middleware/error');
const todoRoutes = require('./app/routes/todoRoutes'); // Importing todoRoutes module
const userRoutes = require('./app/routes/userRoutes'); // Importing todoRoutes module
const publicRoutes = require('./app/routes/publicRoutes'); // Importing todoRoutes module
const db = require('./app/utils/db'); // Importing database utility to connect with MongoDB

const app = express();
const port = 3001; // Setting port number

app.use(require('cors')());

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Error handler middleware
app.use(errorHandler);

app.use('/todos', todoRoutes); // Using todoRoutes for '/todos' endpoint
app.use('/user', userRoutes); // Using todoRoutes for '/todos' endpoint
app.use('/api/todos', publicRoutes); // Using publicRoutes for '/api' endpoint

app.listen(port, () => {
    // Starting server and listening on specified port
    console.log(`Server is listening on port ${port}`); // Logging server start message
});
