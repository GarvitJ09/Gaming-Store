const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // User's full name
    email: { type: String, required: true, unique: true }, // User's email (must be unique)
    phone: { type: String }, // User's phone number
    password: { type: String }, // Hashed password
    role: { type: String, enum: ['user', 'admin', 'rider'], default: 'user' }, // Role of the user
    address: { type: String }, // Address for customers or riders
    firebaseUid: { type: String, required: true }, // Link to Firebase UID
    riderDetails: {
      vehicleType: {
        type: String,
        enum: ['Bike', 'Car', 'Van'],
        default: null,
      }, // Rider's vehicle type
      licenseNumber: { type: String, default: null }, // Rider's license number
    },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);
