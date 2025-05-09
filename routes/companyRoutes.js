const express = require('express');
const router = express.Router();
const controller = require('../controllers/companyController');

router.get('/', controller.getCompanies);
router.post('/', controller.addCompany);

module.exports = router;


