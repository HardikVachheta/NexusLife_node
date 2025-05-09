const mongoose = require('mongoose');

const sentMailSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('SentMail', sentMailSchema);
