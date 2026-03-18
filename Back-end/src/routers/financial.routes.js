const express = require('express');
const router = express.Router();
const financialController = require('../controllers/financial.controller');

router.get('/', financialController.getFinancialRecords);
router.post('/', financialController.createFinancialRecord);

module.exports = router;
