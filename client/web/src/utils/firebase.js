import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyBWlJMIT6WEVtyxjGnE8EJYsk6DhmqJnLw',
  authDomain: 'chia-signup.firebaseapp.com',
  projectId: 'chia-signup',
  storageBucket: 'chia-signup.appspot.com',
  messagingSenderId: '962971497026',
  appId: '1:962971497026:web:58e2b740a33e7ed363f3db',
  measurementId: 'G-GE3PRTS1W8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth;
export const analytics = getAnalytics();
