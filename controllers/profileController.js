// controllers/profileController.js
const User = require('../models/User'); // Import your User Mongoose model

// @desc    Get current user's profile data
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
    try {
        // req.user is populated by the auth middleware with the user's ID
        const user = await User.findById(req.user).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User profile not found.' });
        }

        res.json(user);
    } catch (err) {
        console.error('Error fetching user profile:', err.message);
        res.status(500).send('Server Error');
    }
};

// @desc    Update current user's profile data
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
    const { name, email } = req.body; // Destructure fields that can be updated

    // Build profile fields object
    const profileFields = {};
    if (name) profileFields.name = name;
    if (email) profileFields.email = email;

    try {
        let user = await User.findById(req.user);

        if (!user) {
            return res.status(404).json({ msg: 'User not found.' });
        }

        // If email is being updated, check if the new email is already taken by another user
        if (email && email !== user.email) {
            const existingUserWithNewEmail = await User.findOne({ email });
            if (existingUserWithNewEmail && String(existingUserWithNewEmail._id) !== String(req.user)) {
                return res.status(400).json({ msg: 'This email is already registered to another account.' });
            }
        }

        // Find the user by ID and update their profile fields
        user = await User.findByIdAndUpdate(
            req.user,
            { $set: profileFields },
            { new: true, runValidators: true }
        ).select('-password');

        res.json(user);
    } catch (err) {
        console.error('Error updating user profile:', err.message);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ msg: err.message });
        }
        res.status(500).send('Server Error');
    }
};