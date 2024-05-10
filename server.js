// server.js
const express = require('express');
const todoRoutes = require('./app/routes/todoRoutes');
const db = require('./app/utils/db');

const app = express();
const port = 3001;

// Parse JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

app.use('/todos', todoRoutes);

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
