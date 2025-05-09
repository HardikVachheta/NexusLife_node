const SentMail = require('../models/SentMail');

// Get all sent mails
const getAllSentMails = async (req, res) => {
    try {
        const mails = await SentMail.find().sort({ createdAt: -1 });
        res.json(mails);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Add a new sent mail
const createSentMail = async (req, res) => {
    const { name, email, date } = req.body;
    try {
        const newMail = new SentMail({ name, email, date });
        await newMail.save();
        res.status(201).json(newMail);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
};

// Update sent mail
const updateSentMail = async (req, res) => {
    const { id } = req.params;
    const { name, email, date } = req.body;

    try {
        const updated = await SentMail.findByIdAndUpdate(
            id,
            { name, email, date },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Update failed' });
    }
};

const deleteSentMail = async (req, res) => {
    try {
        const mail = await SentMail.findByIdAndDelete(req.params.id);
        if (!mail) {
            return res.status(404).json({ message: 'Mail not found' });
        }
        res.status(200).json({ message: 'Mail deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getAllSentMails,
    createSentMail,
    updateSentMail,
    deleteSentMail
};
