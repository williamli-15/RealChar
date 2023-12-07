/**
 * src/components/CallView/index.jsx
 * User can stop or continue the call. Allows audios playing and switch to TextView.
 *
 * created by Lynchee on 7/16/23
 */

import React, { useEffect, useState } from 'react';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { TbPhoneCall } from 'react-icons/tb';
import { MdCallEnd } from 'react-icons/md';
import { TbMessageChatbot, TbPower, TbShare2 } from 'react-icons/tb';
import IconButton from '../Common/IconButton';
import { setAnalyser } from '../../components/AvatarView';
// utils
import { playAudios } from '../../utils/audioUtils';

const CallView = ({
  isGreetingVideoEnded,
  isRecording,
  isPlaying,
  isResponding,
  audioPlayer,
  handleStopCall,
  handleContinueCall,
  audioQueue,
  audioContextRef,
  audioSourceNodeRef,
  setIsPlaying,
  handleDisconnect,
  setIsCallView,
  sessionId,
  playAudioFromNode,
}) => {
  const { initialize, setInitialize } = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false); // New state to track button click
  const navigate = useNavigate();

  useEffect(() => {
    if (isPlaying && audioContextRef.current) {
      playAudios(
        audioContextRef,
        audioPlayer,
        audioQueue,
        setIsPlaying,
        playAudioFromNode,
        audioSourceNodeRef,
        initialize,
        setInitialize
      );
    }
  }, [isPlaying]);

  const handleButtonClick = () => {
    handleContinueCall();
    setButtonClicked(true); // Set to true after button is clicked
    setIsCallView(false);
  };

  // Only render the button if it has not been clicked
  const renderButton = () => {
    if (!buttonClicked && isGreetingVideoEnded) {
      return (
        <IconButton
          textLabel='START'
          textColor='white' // Optional if you want to change the default color
          className='icon-button-black' // Assuming you have a black class for bgcolor
          bgcolor='black'
          onClick={handleButtonClick}
        />
      );
    }
    return null;
  };

  return (
    <div className='call-screen'>
      <div className='call-container'>
        <audio ref={audioPlayer} className='audio-player'>
          <source src='' type='audio/mp3' />
        </audio>
        {/* <div className={`sound-wave ${isRecording ? '' : 'stop-animation'}`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div> */}
        {/* {isRecording ? (
          <IconButton
            Icon={MdCallEnd}
            className='icon-black'
            bgcolor='black'
            onClick={handleStopCall}
          />
        ) : (
          <IconButton
            Icon={TbPhoneCall}
            className='icon-black'
            bgcolor='black'
            onClick={handleContinueCall}
          />
        )} */}
        {renderButton()} {/* Render the button based on the state */}
      </div>
      {/* <div className='options-container'>
        <IconButton
          Icon={TbPower}
          className='icon-red'
          onClick={handlePowerOffClick}
        />
        <IconButton
          Icon={TbMessageChatbot}
          className='icon-green'
          onClick={() => setIsCallView(false)}
        />
        <IconButton
          Icon={TbShare2}
          disabled={isResponding}
          onClick={() =>
            window.open(`/shared?session_id=${sessionId}`, '_blank')
          }
        />
      </div> */}
    </div>
  );
};

export default CallView;
