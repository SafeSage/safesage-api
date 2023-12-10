const express = require('express');
const auth = require('./../middlewares/auth.middleware');
const { signUp, login } = require('./../controllers/auth.controller');

// Initializing router
const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

module.exports = router;
