/**
 * src/pages/Conversation.jsx
 *
 * created by Lynchee on 7/28/23
 */

import React, { useEffect, useState } from 'react';
import CallView from '../components/CallView';
import TextView from '../components/TextView';
import StatusIndicator from '../components/StateIndicator';
import { useNavigate, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import Avatar from '@mui/material/Avatar';
import useAvatarView from '../components/AvatarView';
import { extractEmotionFromPrompt } from '@avatechai/avatars';
import lz from 'lz-string';
import Button from '@mui/material/Button';
import {
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
  // --------
  // 【video vars】
  // 【Start】
  // --------
  const talkVideo = React.useRef(null);
  // eslint-disable-next-line no-undef
  const testExampleVideoUrl = 'http://localhost:8000/static/Joker.mp4';
  const prevTextAreaValue = React.useRef(textAreaValue);
  const [pcState, setPcState] = useState('pending');
  // --------
  // 【video vars】
  // 【End】
  // --------

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
      const isSelf = diffText.indexOf('You> ') !== -1;
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

  const handleClickPlay = async () => {
    await sendConnectionRequest(selectedCharacter.image_url);
    setTimeout(() => {
      setPcState('success');
    }, 8000);
  };
  const handleClickStop = async () => {
    setPcState('error');
    await sendDisconnectRequest();
    setTimeout(() => {
      setPcState('pending');
    }, 5000);
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
          <video
            autoPlay
            id='talking-video'
            ref={talkVideo}
            className={`speech-video`}
          >
            <source src={testExampleVideoUrl} type='video/mp4'></source>
          </video>
        )}
      </div>

      <div className={`did-button-group`}>
        <Button
          className={`did-button`}
          color='primary'
          variant='contained'
          size='middle'
          onClick={handleClickPlay}
        >
          Start
        </Button>
        <Button
          className={`did-button`}
          color='error'
          variant='contained'
          size='middle'
          onClick={handleClickStop}
        >
          Stop
        </Button>
      </div>

      <StatusIndicator status={pcState}></StatusIndicator>

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
