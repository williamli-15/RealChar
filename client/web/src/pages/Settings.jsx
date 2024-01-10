/**
 * src/pages/Settings.jsx
 *
 * created by Lynchee on 7/28/23
 */

// TODO: user can access this page only if isConnected.current and selectedCharacter

import React, { useState, useEffect } from 'react';
import Languages from '../components/Languages';
import MediaDevices from '../components/MediaDevices';
import Models from '../components/Models';
import Button from '@mui/material/Button';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import './styles.css';
import CommunicationMethod from '../components/CommunicationMethod';
import AdvancedOptions from '../components/AdvancedOptions';
import lz from 'lz-string';

const Settings = ({
  setSelectedCharacter,
  isMobile,
  preferredLanguage,
  setPreferredLanguage,
  selectedDevice,
  setSelectedDevice,
  selectedModel,
  setSelectedModel,
  isLoggedIn,
  token,
  setToken,
  useSearch,
  setUseSearch,
  useQuivr,
  setUseQuivr,
  quivrApiKey,
  setQuivrApiKey,
  quivrBrainId,
  setQuivrBrainId,
  useMultiOn,
  setUseMultiOn,
  useEchoCancellation,
  setUseEchoCancellation,
  send,
  connect,
  setIsCallView,
  shouldPlayAudio,
}) => {
  const navigate = useNavigate();
  const [commMethod, setCommMethod] = useState('Call');

  const { search } = useLocation();
  const { character = '' } = queryString.parse(search);

  useEffect(() => {
    const selectedCharacter = JSON.parse(
      lz.decompressFromEncodedURIComponent(character)
    );
    setSelectedCharacter(selectedCharacter);

    if (!selectedCharacter) {
      navigate('/');
    }
  }, [setSelectedCharacter, character, navigate]);

  const handleStartClick = async () => {
    await connect();

    const params = new URLSearchParams(window.location.search);
    const rate = params.get('rate');

    // TODO(UI): Show loading animation

    const interval = setInterval(() => {
      // display callview
      setIsCallView(commMethod === 'Call');

      shouldPlayAudio.current = true;
      clearInterval(interval);

      // TODO(UI): Hide loading animation
    }, 500);

    navigate(
      '/conversation?isCallViewParam=' +
        (commMethod === 'Call') +
        '&character=' +
        character +
        '&preferredLanguage=' +
        preferredLanguage +
        '&selectedDevice=' +
        (selectedDevice || 'default') +
        '&selectedModel=' +
        selectedModel +
        '&useSearchParam=' +
        useSearch +
        '&useMultiOnParam=' +
        useMultiOn +
        '&useEchoCancellationParam=' +
        useEchoCancellation +
        '&rate=' +
        rate
    );
  };

  return (
    <div className='settings'>
      <h2 className='center'>Which Language Interests You?</h2>

      {/* <CommunicationMethod
        commMethod={commMethod}
        setCommMethod={setCommMethod}
      /> */}

      <Languages
        preferredLanguage={preferredLanguage}
        setPreferredLanguage={setPreferredLanguage}
      />

      {/* <MediaDevices
        selectedDevice={selectedDevice}
        setSelectedDevice={setSelectedDevice}
      /> */}

      {/* <Models
        isMobile={isMobile}
        selectedModel={selectedModel}
        setSelectedModel={setSelectedModel}
      /> */}

      {/* <AdvancedOptions
        isLoggedIn={isLoggedIn}
        token={token}
        setToken={setToken}
        useSearch={useSearch}
        setUseSearch={setUseSearch}
        useQuivr={useQuivr}
        setUseQuivr={setUseQuivr}
        quivrApiKey={quivrApiKey}
        setQuivrApiKey={setQuivrApiKey}
        quivrBrainId={quivrBrainId}
        setQuivrBrainId={setQuivrBrainId}
        useMultiOn={useMultiOn}
        setUseMultiOn={setUseMultiOn}
        useEchoCancellation={useEchoCancellation}
        setUseEchoCancellation={setUseEchoCancellation}
        send={send}
      /> */}

      <div className='center'>
        <p>
          <br /> <br />
          <strong>🌟Tip:</strong> When you see the animated sound wave,
          that&apos;s your cue to speak. 🗣️ <br /> <br /> When it&apos;s still,
          your coach is taking a breather. Enjoy learning!
        </p>
      </div>

      <div className='button-container'>
        <Button
          variant='contained'
          onClick={handleStartClick}
          size='large'
          sx={{
            border: '1px solid black',
            '&:hover': {
              backgroundColor: 'white',
            },
            '&:active': {
              backgroundColor: 'black',
              color: 'white',
            },
            textTransform: 'none',
            width: '200px',
            fontFamily: 'Courier, monospace',
            borderRadius: '10px',
            backgroundColor: 'white',
            color: 'black',
            marginTop: '20px', // Add this line to lower the button
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Settings;
