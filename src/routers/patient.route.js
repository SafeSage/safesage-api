const express = require('express');
const auth = require('./../middlewares/auth.middleware');
const { connectToGuardian } = require('./../controllers/patient.controller');

// Initializing router
const router = express.Router();

router.post(
    '/connect-to-guardian',
    [auth.verifyJwt, auth.accountActivatedTrue],
    connectToGuardian
);

module.exports = router;
