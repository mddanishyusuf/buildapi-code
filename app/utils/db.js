// app/db.js
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_STRING, {});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = db;
