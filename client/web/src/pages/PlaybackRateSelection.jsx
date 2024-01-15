// src/pages/PlaybackRateSelection.jsx

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import './styles.css';

import Button from '@mui/material/Button';

const paddingValues = {
  0.75: { left: 0, right: 28 },
  0.8: { left: 78, right: 103 },
  0.85: { left: 152, right: 177 },
  0.9: { left: 227, right: 252 },
  0.95: { left: 302, right: 326 },
  1.0: { left: 375, right: 420 },
};

const PlaybackRateSelection = () => {
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const navigate = useNavigate();
  const sliderRef = useRef(null);

  // Function to calculate background gradient based on the paddingValues array
  const calculateBackground = rate => {
    const padding = paddingValues[rate];
    if (!padding) return 'black'; // Fallback color

    const leftPadding = padding.left;
    const rightPadding = padding.right;

    return `linear-gradient(90deg, grey ${leftPadding}px, transparent ${leftPadding}px, transparent ${rightPadding}px, black ${rightPadding}px)`;
  };

  const handleRateChange = e => {
    setPlaybackRate(e.target.value);
  };

  const handleSubmit = () => {
    navigate(`/select-character?rate=${playbackRate}`);
  };

  // Inline style for the slider
  const sliderStyle = {
    background: calculateBackground(playbackRate.toString()),
  };

  return (
    <div>
      <h1>Adjust Speaking Speed</h1>
      <input
        ref={sliderRef}
        type='range'
        min='0.75'
        max='1.0'
        step='0.05'
        value={playbackRate}
        onChange={handleRateChange}
        className='custom-slider'
        style={sliderStyle}
      />
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'Courier',
        }}
      >
        <span style={{ color: 'black' }}>Slower</span>
        <span style={{ color: 'black' }}>Faster</span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Button
          variant='contained'
          onClick={handleSubmit}
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
          Continue
        </Button>
      </div>
    </div>
  );
};

export default PlaybackRateSelection;
