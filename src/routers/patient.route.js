const express = require('express');
const auth = require('./../middlewares/auth.middleware');
const upload = require('./../configs/multer');
const {
    connectToGuardian,
    detectFall
} = require('./../controllers/patient.controller');

// Initializing router
const router = express.Router();

router.post(
    '/connect-to-guardian',
    [auth.verifyJwt, auth.accountActivatedTrue],
    connectToGuardian
);

router.post('/detect-fall', upload.single('file'), detectFall);

module.exports = router;
