// server.js
const express = require('express'); // Importing Express framework
const todoRoutes = require('./app/routes/todoRoutes'); // Importing todoRoutes module
const db = require('./app/utils/db'); // Importing database utility to connect with MongoDB

const app = express();
const port = 3001; // Setting port number

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use('/todos', todoRoutes); // Using todoRoutes for '/todos' endpoint

app.listen(port, () => {
    // Starting server and listening on specified port
    console.log(`Server is listening on port ${port}`); // Logging server start message
});
