import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signInWithEmailAndPassword,createUserWithEmailAndPassword  } from 'firebase/auth';
import { userService } from '../services/userService';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get the token
          const token = await user.getIdToken();
          localStorage.setItem('token', token);
          
          // Get user details from backend
          const userDetails = await userService.getCurrentUser();
          setCurrentUser({ ...user, ...userDetails });
        } catch (error) {
          console.error('Error getting user details:', error);
          setCurrentUser(null);
          localStorage.removeItem('token');
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      
      // Get user details from backend
      const userDetails = await userService.getCurrentUser();
      setCurrentUser({ ...result.user, ...userDetails });
      return result.user;
    } catch (error) {
      console.error('Failed to sign in:', error);
      throw error;
    }
  }

  async function loginWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const token = await result.user.getIdToken();
      localStorage.setItem('token', token);
      await userService.googleLogin({idToken:token});
      // Get user details from backend
      const userDetails = await userService.getCurrentUser();
      setCurrentUser({ ...result.user, ...userDetails });
      return result.user;
    } catch (error) {
      console.error('Failed to sign in with Google:', error);
      throw error;
    }
  }

  async function signup(userData) {
    try {
      // Step 1: Firebase sign-up
      const result = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = result.user;
      console.log("user created in firebase",user);
      // Step 2: Get token and store it
      const token = await user.getIdToken();
      localStorage.setItem('token', token);
  
      // Step 3: Register user in backend
      const firebaseUid = user.uid; 
      console.log("firebaseUid",firebaseUid);
      await userService.registerUser({ firebaseUid ,...userData}); // Adjust this based on your API
      console.log("user registered in backend");
      // Step 4: Fetch user details
      const userDetails = await userService.getCurrentUser();
      setCurrentUser({ ...user, ...userDetails });
  
      return user;
    } catch (error) {
      console.error('Failed to sign up:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await auth.signOut(); 
      setCurrentUser(null);
      localStorage.removeItem('token');
    } catch (error) {
      console.error('Failed to log out:', error);
      throw error;
    }
  }

  const value = {
    currentUser,
    loading,
    login,
    loginWithGoogle,
    signup, 
    logout,
    isAdmin: currentUser?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
