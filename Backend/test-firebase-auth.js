// test-firebase-auth.js - Run this with Node.js to get tokens for testing
const { initializeApp } = require('firebase/app');
const {
  getAuth,
  signInWithEmailAndPassword,
  signInWithCustomToken,
} = require('firebase/auth');

// Replace with your Firebase config
const firebaseConfig = {
  apiKey: 'AIzaSyA8Rn9eBLOBLqgeyYCtWcdFwJHeQisYcL0',
  authDomain: 'gamingecommerce-2b8e3.firebaseapp.com',
  projectId: 'gamingecommerce-2b8e3',
  storageBucket: 'gamingecommerce-2b8e3.firebasestorage.app',
  messagingSenderId: '785294649964',
  appId: '1:785294649964:web:15fc98c3d547576f820649',
  measurementId: 'G-8S71DKSVLH',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Function to get ID token with email/password
async function getIdTokenWithEmailPassword(email, password) {
  try {
    // Sign in with email and password
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Get the ID token
    const idToken = await userCredential.user.getIdToken();
    console.log('ID Token:', idToken);
    return idToken;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
}

// Function to get ID token with custom token
async function getIdTokenWithCustomToken(customToken) {
  try {
    // Sign in with custom token
    const userCredential = await signInWithCustomToken(auth, customToken);

    // Get the ID token
    const idToken = await userCredential.user.getIdToken();
    console.log('ID Token from Custom Token:', idToken);
    return idToken;
  } catch (error) {
    console.error('Error signing in with custom token:', error);
    throw error;
  }
}

// Choose which function to run based on your testing needs
// For testing email/password flow:
// getIdTokenWithEmailPassword('test@example.com', 'password123');

// For testing custom token flow (after getting a custom token from your server):
// getIdTokenWithCustomToken('your-custom-token-here');

module.exports = {
  getIdTokenWithEmailPassword,
  getIdTokenWithCustomToken,
};

// Uncomment and run one of these directly if running this file directly
// getIdTokenWithEmailPassword('test@example.com', 'password123');
// getIdTokenWithCustomToken('your-custom-token-here');
