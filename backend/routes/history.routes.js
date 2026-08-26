const express = require('express');
const historyController = require('../controllers/history.controller');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/', historyController.getHistory);

module.exports = router;
