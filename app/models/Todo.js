// app/models/Todo.js
const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema(
    {
        title: {
            type: 'String',
            required: true,
        },
        completed: Boolean,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Todo', todoSchema);
