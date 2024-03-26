const express = require('express');
const auth = require('./../middlewares/auth.middleware');
const {
    getUniqueId,
    getEvents,
    getAllPatients,
    getEventsByPatient
} = require('./../controllers/guardian.controller');

// Initializing router
const router = express.Router();

router.get(
    '/unique-id',
    [auth.verifyJwt, auth.accountActivatedTrue],
    getUniqueId
);

router.get('/events', [auth.verifyJwt, auth.accountActivatedTrue], getEvents);

router.get(
    '/events/:patientId',
    [auth.verifyJwt, auth.accountActivatedTrue],
    getEventsByPatient
);

router.get(
    '/patients',
    [auth.verifyJwt, auth.accountActivatedTrue],
    getAllPatients
);

module.exports = router;
