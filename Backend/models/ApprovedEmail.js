const mongoose = require('mongoose');

const approvedSchema = new mongoose.Schema({
  email: String,
  role: { type: String, enum: ['user', 'admin', 'rider'], default: 'user' },
});

module.exports = mongoose.model('ApprovedEmail', approvedSchema);
