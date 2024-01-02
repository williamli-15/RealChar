/**
 * src/components/Auth/SignIn.jsx
 */

import React, { useState } from 'react';
import auth from '../../utils/firebase';
import { getHostName } from '../../utils/urlUtils';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './styles.css';

export const sendTokenToServer = async token => {
  // Send token to server
  const scheme = window.location.protocol;
  const url = scheme + '//' + getHostName();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error('Sent token failed');
    }
  } catch (error) {
    console.error('Sent token failed. ', error);
  }
};

export const signInWithGoogle = async (isLoggedIn, setToken) => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: 'select_account',
  });
  return signInWithPopup(auth, provider)
    .then(async result => {
      const token = await auth.currentUser.getIdToken();
      isLoggedIn.current = true;
      setToken(token);
      await sendTokenToServer(token);

      console.log('Sign-in successfully');
      return true; // Indicates successful sign-in
    })
    .catch(error => {
      console.error(`Error occurred during sign in: ${error}`);
      isLoggedIn.current = false;
      return false; // Indicates sign-in failure
    });
};

const SignIn = ({ isLoggedIn, setToken, onSignIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');

  const handleGoogleSignIn = async () => {
    // Check if name is entered before proceeding with Google sign-in
    if (!name) {
      alert('Please enter your name.');
      return; // Stop the function if no name is entered
    }

    setIsLoading(true);
    const success = await signInWithGoogle(isLoggedIn, setToken);
    if (success && isLoggedIn.current) {
      onSignIn(); // Proceed if signed in with Google successfully
    }
    setIsLoading(false);
  };

  return (
    <div className='signin-container'>
      <div className='name-field'>
        <label htmlFor='name'>Name</label>
        <input
          type='text'
          id='name'
          placeholder=''
          value={name}
          onChange={e => setName(e.target.value)}
          disabled={isLoading}
        />
      </div>
      <div className='auth-buttons'>
        <button
          onClick={handleGoogleSignIn}
          className='google-btn'
          disabled={isLoading} // Disable only if loading
        >
          <img src='/google-logo.png' alt='Google' /> Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
