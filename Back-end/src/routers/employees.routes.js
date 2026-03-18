const express = require('express');
const router = express.Router();
const employeesController = require('../controllers/employees.controller');

router.get('/', employeesController.getEmployees);
router.post('/', employeesController.createEmployee);

module.exports = router;
