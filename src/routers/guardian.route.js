const express = require('express');
const auth = require('./../middlewares/auth.middleware');
const { getUniqueId } = require('./../controllers/guardian.controller');

// Initializing router
const router = express.Router();

router.get(
    '/unique-id',
    [auth.verifyJwt, auth.accountActivatedTrue],
    getUniqueId
);

module.exports = router;
