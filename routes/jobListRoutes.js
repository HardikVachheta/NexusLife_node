// routes/jobListRoutes.js
const express = require('express');
const router = express.Router();
// Import the controller functions
const companyController = require('../controllers/companyController'); 

// GET all companies -> calls the getAllCompanies handler
router.get('/', companyController.getAllCompanies);

// POST (add) new companies -> calls the createCompanies handler
router.post('/', companyController.createCompanies);

// GET a single company by ID -> calls the getCompanyById handler
router.get('/:id', companyController.getCompanyById);

// Example PUT route (using a placeholder for the update handler)
// router.put('/:id', companyController.updateCompany);

// Example DELETE route
// router.delete('/:id', companyController.deleteCompany);

module.exports = router;