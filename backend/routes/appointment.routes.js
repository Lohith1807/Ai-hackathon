const express = require('express');
const { createAppointment, getUserAppointments } = require('../controllers/appointment.controller');

const router = express.Router();

router.post('/', createAppointment);
router.get('/user/:userId', getUserAppointments);

module.exports = router;
