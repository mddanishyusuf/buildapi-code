// app/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const publicController = require('../controllers/publicController');

router.get('/', publicController.getAllTodos);
router.get('/:todoId', publicController.getSingleTodo);
router.post('/', publicController.addTodo);
router.put('/', publicController.updateTodo);
router.delete('/', publicController.deleteTodo);

module.exports = router;
