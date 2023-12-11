const express = require('express');
const auth = require('./../middlewares/auth.middleware');
const {
    getUniqueId,
    getEvents
} = require('./../controllers/guardian.controller');

// Initializing router
const router = express.Router();

router.get(
    '/unique-id',
    [auth.verifyJwt, auth.accountActivatedTrue],
    getUniqueId
);

router.get('/events', [auth.verifyJwt, auth.accountActivatedTrue], getEvents);

module.exports = router;
