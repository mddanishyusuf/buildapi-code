// app/routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/profile', userController.getUserProfile);
router.post('/profile', userController.createProfile);

module.exports = router;
