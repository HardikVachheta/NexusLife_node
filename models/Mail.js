const mongoose = require('mongoose');

const MailSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  email: { type: String, required: true },
  date: { type: Date, required: true },
  type: { type: String, enum: ['sent', 'received', 'pending', 'interview'] },
  description: String,
}, { timestamps: true });
// name: { type: String, required: true },

module.exports = mongoose.model('Mail', MailSchema);
