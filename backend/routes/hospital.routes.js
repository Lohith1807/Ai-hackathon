const express = require('express');
const { getAllHospitals } = require('../controllers/hospital.controller');

const router = express.Router();

router.get('/', getAllHospitals);

module.exports = router;
