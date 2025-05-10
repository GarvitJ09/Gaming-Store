const express = require('express');
const admin = require('../config/firebase'); // Firebase Admin
const User = require('../models/User'); // User model
const router = express.Router();
const authenticateFirebaseToken = require('../middlewares/authMiddleware');
const { isAdmin } = require('../middlewares/authMiddleware');

/**
 * Traditional Signup (Email/Password)
 */
router.post('/signup', async (req, res) => {
  try {
    const { firebaseUid, name, email, phone, password, role, address } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
 

    // Check if user already exists in DB
    let user = await User.findOne({ email });
    if (user) {
      return res.status(409).json({ message: 'User already exists' });
    }  

    // Create new user in MongoDB
    user = new User({
      firebaseUid,
      name,
      email,
      phone,
      role: role || 'user', // Default to 'user' if no role specified
      address,
    });
    console.log("user saving in mongodb",user);
    await user.save();
    console.log("user created in mongodb",user); 

    res.status(201).json({ 
      message: 'User created successfully',
      user: {
        ...user.toObject()
      } 
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ 
      message: 'Internal server error', 
      error: error.message,
      code: error.code || 'auth/signup-failed'
    });
  }
});

/**
 * Traditional Login (Email/Password)
 */
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        code: 'auth/missing-credentials'
      });
    }

    // Find user in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        code: 'auth/user-not-found'
      });
    }

    // Verify password with Firebase
    try {
      await admin.auth().getUserByEmail(email);
    } catch (error) {
      return res.status(401).json({ 
        message: 'Invalid credentials',
        code: 'auth/invalid-credentials'
      });
    }

    // Generate Firebase custom token
    const customToken = await admin.auth().createCustomToken(user.firebaseUid);

    res.json({ 
      user: {
        ...user.toObject(),
        password: undefined
      },
      customToken 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: 'Login failed', 
      error: error.message,
      code: error.code || 'auth/login-failed'
    });
  }
});

/**
 * Google Login/Signup
 */
router.post('/google', async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ 
        message: 'Google ID token is required',
        code: 'auth/missing-token'
      });
    }

    // Verify Google ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, uid, picture } = decodedToken;

    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        firebaseUid: uid,
        name: name || 'Google User',
        email,
        phone: '',
        address: '',
        role: 'user', // Default role for Google signup
        avatar: picture,
      });
      await user.save();
    }

    // Create session cookie
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    // Set cookie options
    const options = {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    };

    res.cookie('session', sessionCookie, options);
    res.json({ 
      user: {
        ...user.toObject(),
        password: undefined
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ 
      message: 'Google login failed', 
      error: error.message,
      code: error.code || 'auth/google-login-failed'
    });
  }
});

/**
 * Get current user details
 */
router.get('/me', authenticateFirebaseToken, async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.firebaseUid });
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        code: 'auth/user-not-found'
      });
    }

    res.json({ 
      user: {
        ...user.toObject(),
        password: undefined
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      message: 'Failed to get user details',
      error: error.message,
      code: error.code || 'auth/get-user-failed'
    });
  }
});

/**
 * Logout route
 */
router.post('/logout', authenticateFirebaseToken, async (req, res) => {
  try {
    res.clearCookie('session');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      message: 'Logout failed',
      error: error.message,
      code: error.code || 'auth/logout-failed'
    });
  }
});

/**
 * Admin-only route to get all users
 */
router.get('/users', authenticateFirebaseToken, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 });
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      message: 'Failed to get users',
      error: error.message,
      code: error.code || 'auth/get-users-failed'
    });
  }
});

/**
 * Admin-only route to update user role
 */
router.put('/users/:userId/role', authenticateFirebaseToken, isAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      return res.status(400).json({ 
        message: 'Invalid role. Must be either "user" or "admin"',
        code: 'auth/invalid-role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        code: 'auth/user-not-found'
      });
    }

    res.json({ user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(500).json({ 
      message: 'Failed to update user role',
      error: error.message,
      code: error.code || 'auth/update-role-failed'
    });
  }
});

module.exports = router;
