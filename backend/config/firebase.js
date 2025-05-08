const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json'); // Replace with your Firebase service account key

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

module.exports = admin;
