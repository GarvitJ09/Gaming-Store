import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyA8Rn9eBLOBLqgeyYCtWcdFwJHeQisYcL0',
  authDomain: 'gamingecommerce-2b8e3.firebaseapp.com',
  projectId: 'gamingecommerce-2b8e3',
  storageBucket: 'gamingecommerce-2b8e3.firebasestorage.app',
  messagingSenderId: '785294649964',
  appId: '1:785294649964:web:15fc98c3d547576f820649',
  measurementId: 'G-8S71DKSVLH',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();
export const storage = getStorage(app);
export { firebaseConfig };
export default app;
