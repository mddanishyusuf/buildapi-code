// app/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/', todoController.getAllTodos);
router.post('/', todoController.addTodo);
router.put('/', todoController.updateTodo);
router.delete('/', todoController.deleteTodo);

module.exports = router;
