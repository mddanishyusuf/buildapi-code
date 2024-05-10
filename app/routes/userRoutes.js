// app/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/profile/:uid', userController.getUserProfile);

module.exports = router;
