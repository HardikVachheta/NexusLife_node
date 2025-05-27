// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController'); // Import the new controller
const protect = require('../middleware/auth'); // Import the authentication middleware

router.get('/', protect, controller.getProfile);
router.put('/', protect, controller.updateProfile);

module.exports = router;