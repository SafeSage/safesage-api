const express = require('express');
const auth = require('./../middlewares/auth.middleware');
const {
    signUp,
    login,
    verifyOtp,
    sendOtpEmail
} = require('./../controllers/auth.controller');

// Initializing router
const router = express.Router();

router.post('/signup', signUp);

router.post('/login', login);

router.post('/verify-otp', auth.verifyJwt, verifyOtp);

router.post('/send-otp', auth.verifyJwt, sendOtpEmail);

module.exports = router;
