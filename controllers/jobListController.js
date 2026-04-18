// controllers/jobListController.js
const Company = require('../models/companyModel'); // Import the Company model

// Handler to GET all companies
exports.getAllCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        // Send a 500 (Internal Server Error) if something goes wrong with the DB
        res.status(500).json({ message: err.message });
    }
};

// Handler to POST (add) new companies
exports.createCompanies = async (req, res) => {
    try {
        // req.body can be a single object or an array of objects for insertMany
        const companies = await Company.insertMany(req.body);
        // Send a 201 (Created) status for successful creation
        res.status(201).json(companies);
    } catch (error) {
        // Send a 400 (Bad Request) for validation errors or bad data
        res.status(400).json({ message: error.message });
    }
};

// Handler to GET a single company by ID
exports.getCompanyById = async (req, res) => {
    try {
        // The ID comes from the route parameter
        const company = await Company.findById(req.params.id);
        if (!company) {
            // Send a 404 (Not Found) if the ID doesn't match
            return res.status(404).json({ message: 'Company not found' });
        }
        res.json(company);
    } catch (err) {
        // Check for common error types (like invalid ID format)
        if (err.kind === 'ObjectId') {
             return res.status(404).json({ message: 'Company not found with that ID format' });
        }
        res.status(500).json({ message: err.message });
    }
};

// You'd add your update/delete logic here as well:
// exports.updateCompany = async (req, res) => { ... }
// exports.deleteCompany = async (req, res) => { ... }