const admin = require('../config/firebase'); // Firebase Admin SDK
const User = require('../models/User'); // User model

const authenticateFirebaseToken = async (req, res, next) => {
  try {
    let decodedToken;

    // Check for session cookie first
    const sessionCookie = req.cookies.session;
    if (sessionCookie) {
      try {
        decodedToken = await admin.auth().verifySessionCookie(sessionCookie, true);
      } catch (error) {
        console.error('Session cookie verification failed:', error);
        // Don't return error here, try Bearer token next
      }
    }

    // If no valid session cookie, try Bearer token
    if (!decodedToken) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ 
          message: 'No valid authentication token found',
          code: 'auth/no-token'
        });
    }

      const idToken = authHeader.split('Bearer ')[1];
      try {
        decodedToken = await admin.auth().verifyIdToken(idToken);
      } catch (error) {
        console.error('ID token verification failed:', error);
        return res.status(401).json({ 
          message: 'Invalid authentication token',
          code: 'auth/invalid-token'
        });
      }
    }

    // Find the user in MongoDB using the Firebase UID
    const user = await User.findOne({ firebaseUid: decodedToken.uid });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        code: 'auth/user-not-found'
      });
    }

    // Add user info to request
    req.user = {
      _id: user._id,
      firebaseUid: decodedToken.uid,
      email: decodedToken.email,
      role: user.role // Get role from MongoDB user document
    };

    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ 
      message: 'Authentication failed',
      error: error.message,
      code: error.code || 'auth/failed'
    });
  }
};

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ 
      message: 'Access denied. Admin privileges required.',
      code: 'auth/admin-required'
    });
  }
};

// Export both middleware functions
module.exports = authenticateFirebaseToken;
module.exports.isAdmin = isAdmin;
