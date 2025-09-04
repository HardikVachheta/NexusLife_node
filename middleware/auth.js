// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct relative to auth.js

const protect = async (req, res, next) => {
    // Get token from the 'Authorization' header
    const authHeader = req.header('Authorization');

    // Check if Authorization header exists and starts with 'Bearer '
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ msg: 'No token, authorization denied. Please provide a Bearer token.' });
    }  

    // Extract the token (remove 'Bearer ' prefix)
    const token = authHeader.split(' ')[1];

    // Verify token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach user ID from token payload to the request object
        req.user = await User.findById(decoded.id).select('-password');
        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        console.error('Authentication failed:', error);
        res.status(401).json({ msg: 'Token is not valid or expired.' });
    }
};

module.exports = protect;