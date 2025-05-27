// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/profileController'); // Import the new controller

const auth = require('../middleware/auth'); // Import the authentication middleware

router.get('/', auth, controller.getProfile);
router.put('/', auth, controller.updateProfile);

module.exports = router;