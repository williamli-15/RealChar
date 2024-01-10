// src/pages/PlaybackRateSelection.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlaybackRateSelection = () => {
  const [playbackRate, setPlaybackRate] = useState(1.0);
  const navigate = useNavigate();

  const handleRateChange = e => {
    setPlaybackRate(e.target.value);
  };

  const handleSubmit = () => {
    navigate(`/select-character?rate=${playbackRate}`);
  };

  return (
    <div>
      <h1>Select Playback Rate</h1>
      <input
        type='range'
        min='0.75'
        max='1.0'
        step='0.05'
        value={playbackRate}
        onChange={handleRateChange}
      />
      <p>Current Rate: {playbackRate}</p>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default PlaybackRateSelection;
