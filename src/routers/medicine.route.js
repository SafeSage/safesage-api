const express = require('express');
const auth = require('./../middlewares/auth.middleware');

const {
    addMedicine,
    updateMedicine,
    getMedicine,
    getAllMedicines,
    deleteMedicine
} = require('./../controllers/medicine.controller');

// Initializing router
const router = express.Router();

router.post(
    '/',
    [auth.verifyJwt, auth.accountActivatedTrue],
    addMedicine
);

router.patch(
    '/:medicineId',
    [auth.verifyJwt, auth.accountActivatedTrue],
    updateMedicine
);

router.get(
    '/:medicineId',
    [auth.verifyJwt, auth.accountActivatedTrue],
    getMedicine
);

router.get(
    '/all/:patientId',
    [auth.verifyJwt, auth.accountActivatedTrue],
    getAllMedicines
);

router.delete(
    '/:medicineId',
    [auth.verifyJwt, auth.accountActivatedTrue],
    deleteMedicine
);

module.exports = router;