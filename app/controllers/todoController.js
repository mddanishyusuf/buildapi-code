// app/controllers/todoController.js
const Todo = require('../models/Todo');
const User = require('../models/User');

const { responseList } = require('../errors/responseList');

exports.getAllTodos = async (req, res) => {
    const { uid } = req.headers;
    try {
        const user = await User.findOne({ uid });
        if (!user) return res.status(401).send(responseList(401));

        const todos = await Todo.find({ author: user }).exec();
        res.status(200).send({ todos, user });
    } catch (err) {
        res.status(500).send(responseList(500, err.message));
    }
};

exports.addTodo = async (req, res) => {
    try {
        const { uid } = req.headers;
        const { title } = req.body;

        const user = await User.findOne({ uid });
        if (!user) return res.status(401).send(responseList(401));

        const todo = new Todo({ title, author: user });
        await todo.save();
        res.status(201).json(todo);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { uid } = req.headers;
        const { _id, status } = req.body;

        const user = await User.findOne({ uid });
        if (!user) return res.status(401).send(responseList(401));

        const todo = await Todo.findByIdAndUpdate(
            _id,
            { completed: status },
            { new: true }
        );
        if (!todo) {
            return res.status(404).json(responseList(401, 'Todo not found'));
        }
        res.status(200).send(responseList(200));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { uid } = req.headers;
        const { _id } = req.body;

        const user = await User.findOne({ uid });
        if (!user) return res.status(401).send(responseList(401));

        const todo = await Todo.findByIdAndDelete(_id);
        if (!todo) {
            return res.status(404).json(responseList(401, 'Todo not found'));
        }
        res.status(200).send(responseList(200));
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
