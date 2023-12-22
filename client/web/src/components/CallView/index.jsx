/**
 * src/components/CallView/index.jsx
 * User can stop or continue the call. Allows audios playing and switch to TextView.
 *
 * created by Lynchee on 7/16/23
 */

import React, { useEffect, useRef, useState } from 'react';
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
  textAreaValue,
  selectedCharacter,
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
  const chatWindowRef = useRef(null); // migrated from TextView
  const [colorClass, setColorClass] = useState('white-text'); // default class; migrated from TextView
  const [displayedText, setDisplayedText] = useState(''); // new; for controlling text speed
  const [currentIndex, setCurrentIndex] = useState(0); // new; for controlling text speed
  const { initialize, setInitialize } = useState(true);
  const [buttonClicked, setButtonClicked] = useState(false); // New state to track button click
  const navigate = useNavigate();

  const smoothScrollToBottom = (element, duration) => {
    const start = element.scrollTop;
    let end = element.scrollHeight;
    const lines = element.value.split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
      if (lines[i].trim() !== '') {
        // Calculate the position up to this line and adjust for potential off-by-one error
        end = Math.min(
          end,
          element.scrollHeight -
            ((lines.length - 1.5 - i) * element.scrollHeight) / lines.length
        );
        break;
      }
    }

    const change = end - start;
    let currentTime = 0;
    const increment = 20;

    const animateScroll = () => {
      currentTime += increment;
      const val = Math.easeInOutQuad(currentTime, start, change, duration);
      element.scrollTop = val;
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    animateScroll();
  };

  // Ease function for smooth animation
  Math.easeInOutQuad = (t, b, c, d) => {
    t /= d / 2;
    if (t < 1) return (c / 2) * t * t + b;
    t--;
    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  // (Scrolling ver.)  always show the latest chat log
  useEffect(() => {
    if (chatWindowRef.current) {
      smoothScrollToBottom(chatWindowRef.current, 50); // 2000 ms for smooth scroll
    }
  }, [textAreaValue]);

  // (Scrolling ver.) Adjusting the Typing Effect with Scrolling
  useEffect(() => {
    if (currentIndex < textAreaValue.length - 3) {
      const timer = setTimeout(() => {
        // setDisplayedText(textAreaValue.slice(0, currentIndex + 1));
        // setCurrentIndex(currentIndex + 1);
        // Get the current portion of text to be displayed
        let currentText = textAreaValue.slice(0, currentIndex + 1);

        // Add a blank line to the current text
        currentText += '\n';

        // Set the text with the added blank line
        setDisplayedText(currentText);
        setCurrentIndex(currentIndex + 1);

        // Calculate the height of two lines (adjust based on your styling)
        const twoLineHeight = chatWindowRef.current.clientHeight * 2;
        const earlyTriggerHeight = twoLineHeight * 0.9;
        // Check if the textarea content exceeds the height of two lines
        if (
          chatWindowRef.current.scrollHeight - chatWindowRef.current.scrollTop >
          earlyTriggerHeight
        ) {
          smoothScrollToBottom(chatWindowRef.current, 50);
        }
      }, 58); // Adjust typing speed here

      return () => clearTimeout(timer);
    } else {
      // Trigger smooth scroll after typing is done
      smoothScrollToBottom(chatWindowRef.current, 50);
    }
  }, [currentIndex, textAreaValue]);

  //   // Check if the textarea is almost filled and start scrolling
  //   if (
  //     chatWindowRef.current.scrollHeight -
  //       chatWindowRef.current.scrollTop <=
  //     chatWindowRef.current.clientHeight * 1.2
  //   ) {
  //     smoothScrollToBottom(chatWindowRef.current, 50);
  //   }
  // }, 50); // Adjust typing speed here

  // (Scrolling ver.) Reset effect when textAreaValue changes
  useEffect(() => {
    setCurrentIndex(displayedText.length);
    // if (textAreaValue.startsWith(displayedText)) {
    //   // Text is being appended. Start typing from the current index.
    //   setCurrentIndex(displayedText.length);
    // } else {
    //   // Text is completely new. Reset and start from the beginning.
    //   setDisplayedText('');
    //   setCurrentIndex(0);
    // }
  }, [textAreaValue]);

  useEffect(() => {
    // Array of character names for which the text should be black
    const blackTextCharacters = [
      'ProfessorAlexanderKnight',
      // Add more character names as needed
    ];
    const newColorClass = blackTextCharacters.includes(selectedCharacter.name)
      ? 'black-text'
      : 'white-text';
    setColorClass(newColorClass);
  }, [selectedCharacter.name]);

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
        <textarea
          className={`chat-window ${colorClass}`}
          readOnly
          draggable='false'
          ref={chatWindowRef}
          value={displayedText} // Use displayedText here
        ></textarea>
        <div style={{ marginTop: '60px' }}></div> {/* Add space here */}
        <audio ref={audioPlayer} className='audio-player'>
          <source src='' type='audio/mp3' />
        </audio>
        <div className={`sound-wave ${isRecording ? '' : 'stop-animation'}`}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
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
