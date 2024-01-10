/**
 * src/pages/Home.jsx
 *
 * created by Lynchee on 7/28/23
 */

import React, { useState, useRef, useEffect } from 'react';
import { isIP } from 'is-ip';
import { useNavigate } from 'react-router-dom';
import lz from 'lz-string';

import Characters from '../components/Characters';
import Button from '@mui/material/Button';
import { getHostName } from '../utils/urlUtils';
import { signInWithGoogle } from '../components/Auth/SignIn';

const Home = ({
  isMobile,
  selectedCharacter,
  setSelectedCharacter,
  isPlaying,
  characterGroups,
  setCharacterGroups,
  setCharacterConfirmed,
  characterConfirmed,
  token,
  setToken,
  isLoggedIn,
}) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const texts = [
    'Hello,',
    'Welcome to Chia,',
    "The world's first interactive\ndigital persona language learning platform",
  ];
  const typingDelay = 61;
  const fadeDelay = 1000;

  // Get characters. This effect is for fetching characters
  useEffect(() => {
    setLoading(true);

    // Get host
    const scheme = window.location.protocol;
    const url = scheme + '//' + getHostName() + '/characters';
    let headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(data => {
        setCharacterGroups(data);
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
      });
  }, [setCharacterGroups, token]);

  // Start the typing animation for the first text when the component mounts and loading is done
  useEffect(() => {
    if (loading) return;
    const typingAnimation = index => {
      if (index < texts[textIndex].length) {
        setCurrentText(texts[textIndex].substring(0, index + 1));
        setTimeout(() => typingAnimation(index + 1), typingDelay);
      } else {
        setTimeout(() => {
          setCurrentText('');
          if (textIndex < texts.length - 1) {
            setTextIndex(textIndex + 1);
          } else {
            setIsAnimationComplete(true);
          }
        }, fadeDelay);
      }
    };
    typingAnimation(0);
  }, [textIndex, loading]);

  const handleNextClick = () => {
    setCharacterConfirmed(true);
    const compressedCharacter = lz.compressToEncodedURIComponent(
      JSON.stringify(selectedCharacter)
    );
    const rate = new URLSearchParams(window.location.search).get('rate');
    navigate(`/settings?character=${compressedCharacter}&rate=${rate}`);
  };

  const handleCreateCharacter = () => {
    if (!isLoggedIn.current) {
      signInWithGoogle(isLoggedIn, setToken).then(() => {
        if (isLoggedIn.current) {
          navigate('/create');
        }
      });
    } else {
      navigate('/create');
    }
  };

  const renderTextWithLineBreaks = text => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {index === 0 ? (
          // The first line will inherit styles from .typing-text
          <span>{line}</span>
        ) : (
          // The second line will have its own class .second-line
          <div className='second-line'>{line}</div>
        )}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getMarginLeft = () => {
    switch (textIndex) {
      case 0:
        return '355px'; // Adjust the value as needed
      case 1:
        return '307px'; // Adjust the value as needed
      case 2:
        return '244px'; // Adjust the value as needed
      default:
        return '0'; // Default margin-left value
    }
  };

  return (
    <div className='home'>
      {/* {loading && <h2>Loading...</h2>} */}
      {/* {!loading && !isAnimationComplete && (
        <div className='typing-container'>
          <p
            key={textIndex}
            className='typing-text'
            style={{ marginLeft: getMarginLeft() }} // Apply margin-left based on textIndex
          >
            {renderTextWithLineBreaks(currentText)}
          </p>
        </div>
      )} */}
      {/* {!loading && isAnimationComplete && ( */}
      {/* <> */}
      <p className='header'>Choose Your Language Coach</p>

      <Characters
        isMobile={isMobile}
        characterGroups={characterGroups}
        selectedCharacter={selectedCharacter}
        setSelectedCharacter={setSelectedCharacter}
        isPlaying={isPlaying}
        characterConfirmed={characterConfirmed}
      />
      {/*<Button*/}
      {/*  variant='contained'*/}
      {/*  color='primary'*/}
      {/*  onClick={handleCreateCharacter}*/}
      {/*  sx={{ marginBottom: '20px' }}*/}
      {/*>*/}
      {/*  Create Your Character*/}
      {/*</Button>*/}

      <Button
        variant='contained'
        onClick={handleNextClick}
        // fullWidth
        size='large'
        disabled={!selectedCharacter}
        sx={{
          marginTop: '200px', // Adjust the margin as needed
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
        }}
      >
        NEXT
      </Button>
      {/* </> */}
      {/* )} */}
    </div>
  );
};

export default Home;
