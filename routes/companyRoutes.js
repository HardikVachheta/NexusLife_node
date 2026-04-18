const express = require('express');
const router = express.Router();
const controller = require('../controllers/companyController');

router.get('/', controller.getCompanies);
router.post('/', controller.addCompany);
router.post('/:id', controller.getCompanyById);

module.exports = router;


