import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button'; // Import Button from MUI

const WelcomeAndGreeting = () => {
  const navigate = useNavigate();
  const videoRef = useRef(null); // Reference to the video element
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false); // State to control video display
  const [animationCompleted, setAnimationCompleted] = useState(false); // State to track completion of text animation
  const texts = [
    'Hello,',
    'Welcome to Chia,',
    "The world's first interactive\ndigital persona language learning platform",
  ];
  const typingDelay = 61;
  const fadeDelay = 1000;

  useEffect(() => {
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
            setAnimationCompleted(true); // Set true when animation is complete
          }
        }, fadeDelay);
      }
    };
    typingAnimation(0);
  }, [textIndex]);

  useEffect(() => {
    if (videoRef.current && showVideo) {
      videoRef.current.onended = () => {
        navigate('/sign-in');
      };
      videoRef.current.play();
    }
  }, [navigate, showVideo]);

  const handleContinueClick = () => {
    setShowVideo(true); // Show the video when "Continue" is clicked
  };

  const renderTextWithLineBreaks = text => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {index === 0 ? (
          <span>{line}</span>
        ) : (
          <div className='second-line'>{line}</div>
        )}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getMarginLeft = () => {
    switch (textIndex) {
      case 0:
        return '355px';
      case 1:
        return '307px';
      case 2:
        return '244px';
      default:
        return '0';
    }
  };

  return (
    <div className='home'>
      <div className='typing-container'>
        <p
          key={textIndex}
          className='typing-text'
          style={{ marginLeft: getMarginLeft() }}
        >
          {renderTextWithLineBreaks(currentText)}
        </p>
      </div>
      {!showVideo && animationCompleted && (
        <Button
          variant='contained'
          onClick={handleContinueClick}
          sx={{
            marginTop: '-20px',
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
          Continue
        </Button>
      )}
      {showVideo && (
        <div className='video-container'>
          <video
            ref={videoRef}
            id='greetingVideo'
            width='100%'
            height='auto'
            controls={false}
            autoPlay
          >
            <source
              src='https://storage.googleapis.com/avatars_bucket/signin.mp4'
              type='video/mp4'
            />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
};

export default WelcomeAndGreeting;
