// src/pages/SignInPage.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import SignIn from '../components/Auth/SignIn';

const SignInPage = ({ isLoggedIn, setToken }) => {
  const navigate = useNavigate();

  // This function will be passed to the SignIn component
  const handleSuccessfulSignIn = () => {
    // No action needed here since navigation will be handled by the "Submit" button
  };

  // This function is called when the "Submit" button is clicked
  const handleSubmit = () => {
    if (isLoggedIn.current) {
      navigate('/playback-rate');
    } else {
      // Optionally provide feedback to the user that they need to sign in with Google
    }
  };

  return (
    <div className='home'>
      <h1>Sign Up</h1>
      <SignIn
        isLoggedIn={isLoggedIn}
        setToken={setToken}
        onSignIn={handleSubmit} // Pass the handleSubmit function instead
      />
    </div>
  );
};

export default SignInPage;
