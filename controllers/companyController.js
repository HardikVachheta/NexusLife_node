const Company = require('../models/Company');

const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        res.json(companies);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
}

// Add a new company
const addCompany = async (req, res) => {
    try {
        const { name, logoUrl, website, phoneNumber, address } = req.body;
        const newCompany = new Company({ name, logoUrl, website, phoneNumber, address });
        await newCompany.save();
        res.status(201).json(newCompany);
    } catch (err) {
        res.status(400).json({ error: 'Invalid data' });
    }
}

// Get single company by ID
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) return res.status(404).json({ error: 'Company not found' });
        res.json(company);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getCompanies,
    addCompany,
    getCompanyById
};
