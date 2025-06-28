const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  firstName: { type: String, required: true },
  secondName: { type: String, required: true },
  nic: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  nicPdfPath: { type: String, required: true },
  licensePdfPath: { type: String, required: true },
  referenceId: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
