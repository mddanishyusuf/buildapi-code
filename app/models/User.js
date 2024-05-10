// app/models/Todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        uid: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        status: {
            type: String,
            default: 'free',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);
