const express = require('express');
const { getDashboardStats } = require('../controllers/admin.controller');

const router = express.Router();

router.get('/dashboard', getDashboardStats);

module.exports = router;
