// app/models/Todo.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
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
        stripe_customer: {
            type: String,
            default: null,
        },
        api_key: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
