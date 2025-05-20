const Mail = require('../models/Mail');

// Get all sent mails
const getAllMails = async (req, res) => {
    try {
        const mails = await Mail.find().sort({ createdAt: -1 });
        res.json(mails);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Add a new sent mail
const createMail = async (req, res) => {
    const { companyId, type, email, date, description } = req.body;
    try {
        const newMail = new Mail({ companyId, type, email, date, description });
        await newMail.save();
        res.status(201).json(newMail);
    } catch (error) {
        res.status(400).json({ error: 'Invalid data' });
    }
};

// Get mails by type
const getMailsByType = async (req, res) => {
    try {
        const mails = await Mail.find({ type: req.params.type }).populate('companyId');
        res.json(mails);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Get mails by company
const getMailsByCompany = async (req, res) => {
    try {
        const mails = await Mail.find({ companyId: req.params.companyId });
        res.json(mails);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Update sent mail
const updateMail = async (req, res) => {
    const { id } = req.params;
        const { companyId, email, date, description, type } = req.body;

    try {
        const updated = await Mail.findByIdAndUpdate(
            id,
            { companyId, email, date, description, type },
            { new: true }
        );
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: 'Update failed' });
    }
};

const deleteMail = async (req, res) => {
    try {
        const mail = await Mail.findByIdAndDelete(req.params.id);
        if (!mail) {
            return res.status(404).json({ message: 'Mail not found' });
        }
        res.status(200).json({ message: 'Mail deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ message: 'Server error' });
    }
}
const getMailSummary = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);

        const startOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
        endOfLastMonth.setHours(23, 59, 59, 999);

        const types = ['sent', 'received', 'interview', 'pending'];

        const summary = {};

        for (const type of types) {
            const [todayDocs, currentMonthCount, lastMonthCount] = await Promise.all([
                Mail.find({
                    type,
                    date: { $gte: today, $lt: tomorrow }
                }).select('email'),

                Mail.countDocuments({
                    type,
                    date: { $gte: startOfCurrentMonth }
                }),

                Mail.countDocuments({
                    type,
                    date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }),
            ]);

            summary[type] = {
                today: todayDocs.map(mail => mail.email),
                currentMonth: currentMonthCount,
                lastMonth: lastMonthCount,
            };
        }

        res.json(summary);
    } catch (err) {
        console.error('Error fetching mail summary:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    getAllMails,
    createMail,
    updateMail,
    deleteMail,
    getMailsByCompany,
    getMailsByType,
    getMailSummary
};
