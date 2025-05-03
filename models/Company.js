const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: String,
  website: String,
  phoneNumber: String,
  address: String
}, { timestamps: true });

module.exports = mongoose.model('Company', companySchema);
