const express = require('express');
const router = express.Router();
const kpiController = require('../controllers/kpi.controller');

router.get('/finance', kpiController.getFinanceKPIs);
router.get('/sales', kpiController.getSalesKPIs);
router.get('/inventory', kpiController.getInventoryKPIs);
router.get('/hr', kpiController.getHRKPIs);
router.get('/summary', kpiController.getKPISummary);

module.exports = router;
