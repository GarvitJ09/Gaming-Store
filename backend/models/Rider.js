const mongoose = require('mongoose');

const riderSchema = new mongoose.Schema({
  email: String,
  name: String,
});

module.exports = mongoose.model('Rider', riderSchema);
