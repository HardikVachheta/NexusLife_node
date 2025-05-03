const express = require('express');
const Company = require('../models/Company');
const router = express.Router();
// const Company = require('../models/Company');

// Get all companies
router.get('/', async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add a new company
router.post('/', async (req, res) => {
  try {
    const { name, logoUrl, website, phoneNumber, address } = req.body;
    const newCompany = new Company({ name, logoUrl, website, phoneNumber, address });
    await newCompany.save();
    res.status(201).json(newCompany);
  } catch (err) {
    res.status(400).json({ error: 'Invalid data' });
  }
});

module.exports = router;
