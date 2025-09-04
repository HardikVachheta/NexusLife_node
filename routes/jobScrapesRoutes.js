const express = require('express');
const router = express.Router();
const controller = require('../controllers/jobScrapesController');

router.get('/:companyName', controller.getJobDetails);

module.exports = router;
