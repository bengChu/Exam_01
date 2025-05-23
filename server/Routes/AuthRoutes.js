// server/Routes/AuthRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../Controllers/AuthController');

router.post('/login', authController.login);

module.exports = router;