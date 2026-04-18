const express = require('express');
const { register, login, recover } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/recover', recover);

module.exports = router;
