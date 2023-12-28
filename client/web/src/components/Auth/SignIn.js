/**
 * src/components/Auth/SignIn.jsx
 * signin and signup with google account
 *
 * created by Lynchee on 7/20/23
 */

import React, { useState } from 'react';
import auth from '../../utils/firebase';
import { getHostName } from '../../utils/urlUtils';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import './styles.css';
import Button from '@mui/material/Button';
import { isIP } from 'is-ip';

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
  return signInWithPopup(auth, provider) // Return the promise here
    .then(async result => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = await auth.currentUser.getIdToken();

      // The signed-in user info.
      const user = result.user;
      isLoggedIn.current = true;
      setToken(token);
      await sendTokenToServer(token);

      console.log('Sign-in successfully');
    })
    .catch(error => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(
        `Error occurred during sign in. Code: ${errorCode}, Message: ${errorMessage}`
      );
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      isLoggedIn.current = false;
    });
};

const SignIn = ({ isLoggedIn, setToken, onSignIn }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState(''); // State to store the name input
  const [isGoogleSignedIn, setIsGoogleSignedIn] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle(isLoggedIn, setToken);
      if (isLoggedIn.current) {
        setIsGoogleSignedIn(true); // Set the flag indicating Google sign-in is successful
      }
    } catch (error) {
      console.error('Error during sign in:', error);
    }
    setIsLoading(false); // Reset loading state regardless of the outcome
  };

  const handleNextClick = () => {
    if (name && isGoogleSignedIn) {
      onSignIn(); // Proceed only if the user has entered a name and signed in with Google
    } else {
      // Optionally provide feedback to the user that they need to sign in with Google
    }
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
          disabled={isLoading}
        >
          <img src='/google-logo.png' alt='Google' /> Sign in with Google
        </button>
      </div>
      <div className='next-button'>
        <Button
          variant='contained'
          onClick={handleNextClick}
          disabled={!name || !isGoogleSignedIn || isLoading}
          // Apply the same styling from the Google button for consistency
          sx={{
            marginTop: '20px',
            border: '1px solid black', // This line sets the border to black
            '&.Mui-disabled': {
              backgroundColor: 'black',
              color: 'white',
            },
            '&:hover': {
              backgroundColor: 'white', // Keeps the button white on hover
            },
            '&:active': {
              backgroundColor: 'black', // Changes the background color to black on click
              color: 'white', // Changes the text color to white on click
            },
            textTransform: 'none',
            width: '200px', // Adjust the width as needed
            fontFamily: 'Courier, monospace', // Set the font to Courier
            borderRadius: '10px', // Adjust the radius to make it more round
            backgroundColor: 'white',
            color: 'black',
            fontWeight: 'bold',
          }}
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
