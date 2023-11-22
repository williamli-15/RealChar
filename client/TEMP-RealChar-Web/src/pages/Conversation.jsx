/**
 * src/pages/Conversation.jsx
 *
 * created by Lynchee on 7/28/23
 */

import React, { useEffect, useState } from 'react';
import CallView from '../components/CallView';
import TextView from '../components/TextView';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Avatar from '@mui/material/Avatar';
import useAvatarView from '../components/AvatarView';
import { extractEmotionFromPrompt } from '@avatechai/avatars';
import lz from 'lz-string';
import Button from '@mui/material/Button';
import {
  initTalkVideo,
  detectVideoEle,
  sendRenderRequest,
  sendConnectionRequest,
  sendDisconnectRequest,
} from '../utils/didApi';

// TODO: user can access this page only if isConnected.current

const Conversation = ({
  isConnecting,
  isConnected,
  isRecording,
  isPlaying,
  isThinking,
  isResponding,
  audioPlayer,
  handleStopCall,
  handleContinueCall,
  audioQueue,
  audioContextRef,
  audioSourceNodeRef,
  setIsPlaying,
  handleDisconnect,
  isCallView,
  setIsCallView,
  send,
  stopAudioPlayback,
  textAreaValue,
  setTextAreaValue,
  messageInput,
  setMessageInput,
  setUseSearch,
  setUseEchoCancellation,
  callActive,
  startRecording,
  stopRecording,
  setPreferredLanguage,
  selectedCharacter,
  messageId,
  token,
  isTextStreaming,
  sessionId,
  setSelectedCharacter,
  setSelectedModel,
  setSelectedDevice,
  setUseMultiOn,
  connect,
}) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const {
    character = '',
    selectedModel = '',
    selectedDevice = '',
    isCallViewParam = '',
    preferredLanguage = '',
    useSearchParam = '',
    useEchoCancellationParam = '',
    useMultiOnParam = '',
  } = queryString.parse(search);
  const isCallViewUrl = isCallViewParam === 'true';
  const useSearch = useSearchParam === 'true';
  const useEchoCancellation = useEchoCancellationParam === 'true';
  const useMultiOn = useMultiOnParam === 'true';
  const message = isTextStreaming ? '' : textAreaValue;
  const [emotion, setEmotion] = useState('');
  // video vars
  const talkVideo = React.useRef(null);
  const streamId = '';
  // eslint-disable-next-line no-undef
  const didApiKey = process.env.REACT_APP_DID_API_KEY;
  const idleVideoUrl = 'http://localhost:8000/static/Joker.mp4';
  // const idleVideoUrl = '';
  const prevTextAreaValue = React.useRef(textAreaValue);

  const { avatarDisplay, playAudioFromNode } = useAvatarView(
    selectedCharacter?.avatar_id,
    emotion
  );

  useEffect(() => {
    const emotion = extractEmotionFromPrompt(message);
    if (emotion && emotion.length > 0) setEmotion(emotion);
  }, [message]);

  useEffect(() => {
    if (
      character === '' ||
      selectedModel === '' ||
      selectedDevice === '' ||
      isCallViewUrl === '' ||
      preferredLanguage === '' ||
      useSearch === '' ||
      useEchoCancellation === ''
    ) {
      navigate('/');
    }
    const paramSelectedCharacter = JSON.parse(
      lz.decompressFromEncodedURIComponent(character)
    );
    setSelectedCharacter(paramSelectedCharacter);

    setSelectedModel(selectedModel);

    setSelectedDevice(selectedDevice);

    setIsCallView(isCallViewUrl);

    setPreferredLanguage(preferredLanguage);

    setUseSearch(useSearch);

    setUseEchoCancellation(useEchoCancellation);

    setUseMultiOn(useMultiOn);
  }, []);

  useEffect(() => {
    if (!isConnecting.current) {
      const tryConnect = async () => {
        try {
          // requires login if user wants to use gpt4 or claude.
          connect();
        } catch (error) {
          console.error(error);
        }
      };
      tryConnect();
    }

    const handleUnload = event => {
      event.preventDefault();
      navigate('/');
    };
    window.addEventListener('beforeunload', handleUnload);

    // Clean up event listener on component unmount
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [connect]);

  useEffect(() => {
    if (textAreaValue !== prevTextAreaValue.current && !isTextStreaming) {
      const diffText = textAreaValue.replace(prevTextAreaValue.current, '');
      const isSelf = diffText.indexOf('You') !== -1;
      const index = diffText.indexOf('> ');
      if (!isSelf && index !== -1) {
        const extractedText = diffText.substring(index + 2); // 加上 2 是为了跳过 "> " 这两个字符
        const strippedText = extractedText.replace(/[\r\n]+/g, '');
        console.info('strippedText: ', strippedText);
        sendRenderRequest(strippedText).then(() => {
          console.info('[sendRenderRequest] done');
        });
      }
      prevTextAreaValue.current = textAreaValue;
    }
  }, [isTextStreaming, textAreaValue]);

  useEffect(() => {
    if (!talkVideo || !talkVideo.current) return;
    console.info('talkVideo.current: ', talkVideo.current);
    console.info('talkVideo.current: ', talkVideo.current.src);
    initTalkVideo(talkVideo.current);
  }, [talkVideo.current]);
  const handleClickPlay = async () => {
    console.info('[Click Play]');
    const video = document.getElementById('talking-video');
    initTalkVideo(video);
    await sendConnectionRequest(
      'https://raw.githubusercontent.com/Jaykef/gradio-practice/main/joker.png'
    );
  };
  const handleClickStop = async () => {
    console.info('stop');
    await sendDisconnectRequest();
  };

  const handleClickTest = async () => {
    console.info('test');
    await sendRenderRequest('Hello World! I am fined, thank you!');
  };

  if (!isConnected.current) {
    return null;
  }

  return (
    <div className='conversation-page'>
      {/* we render both views but only display one. */}
      <p className='alert text-white'>
        {isConnected.current && isThinking && isCallView ? (
          <span>{selectedCharacter.name} is thinking...</span>
        ) : isConnected.current && isRecording ? (
          <span className='recording'>Recording</span>
        ) : null}
      </p>

      <div className={`avatar-wrapper ${isPlaying ? 'pulsating-avatar' : ''}`}>
        {selectedCharacter?.avatar_id ? (
          <>{avatarDisplay}</>
        ) : (
          // <Avatar
          //   alt={selectedCharacter.name}
          //   src={selectedCharacter.image_url}
          //   sx={{ width: 250, height: 250 }}
          //   variant={'rounded'}
          // />
          <video
            autoPlay
            muted
            id='talking-video'
            ref={talkVideo}
            className={`speech-video`}
            poster={selectedCharacter.image_url}
          >
            <source src={idleVideoUrl} type='video/mp4'></source>
          </video>
        )}
      </div>

      <div className={`did-button-group`}>
        <Button
          className={`did-button`}
          color='primary'
          variant='contained'
          onClick={handleClickPlay}
        >
          Start
        </Button>
        <Button
          className={`did-button`}
          color='error'
          variant='contained'
          onClick={handleClickStop}
        >
          Stop
        </Button>
        <Button
          className={`did-button`}
          color='error'
          variant='contained'
          onClick={handleClickTest}
        >
          Test
        </Button>
      </div>

      <div
        className='main-screen'
        style={{ display: isCallView ? 'flex' : 'none' }}
      >
        <CallView
          isRecording={isRecording}
          isPlaying={isPlaying}
          isResponding={isResponding}
          audioPlayer={audioPlayer}
          handleStopCall={handleStopCall}
          handleContinueCall={handleContinueCall}
          audioQueue={audioQueue}
          audioContextRef={audioContextRef}
          audioSourceNodeRef={audioSourceNodeRef}
          setIsPlaying={setIsPlaying}
          handleDisconnect={handleDisconnect}
          setIsCallView={setIsCallView}
          sessionId={sessionId}
          playAudioFromNode={playAudioFromNode}
        />
      </div>

      <div
        className='main-screen'
        style={{ display: isCallView ? 'none' : 'flex' }}
      >
        <TextView
          selectedCharacter={selectedCharacter}
          send={send}
          isPlaying={isPlaying}
          isThinking={isThinking}
          isResponding={isResponding}
          stopAudioPlayback={stopAudioPlayback}
          textAreaValue={textAreaValue}
          setTextAreaValue={setTextAreaValue}
          messageInput={messageInput}
          setMessageInput={setMessageInput}
          handleDisconnect={handleDisconnect}
          setIsCallView={setIsCallView}
          useSearch={useSearch}
          setUseSearch={setUseSearch}
          callActive={callActive}
          startRecording={startRecording}
          stopRecording={stopRecording}
          preferredLanguage={preferredLanguage}
          setPreferredLanguage={setPreferredLanguage}
          messageId={messageId}
          token={token}
          sessionId={sessionId}
        />
      </div>
    </div>
  );
};

export default Conversation;
