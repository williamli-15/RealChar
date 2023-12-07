/**
 * src/pages/Conversation.jsx
 *
 * created by Lynchee on 7/28/23
 */

import React, { useEffect, useState } from 'react';
import CallView from '../components/CallView';
import TextView from '../components/TextView';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import useAvatarView from '../components/AvatarView';
import { extractEmotionFromPrompt } from '@avatechai/avatars';
import lz from 'lz-string';

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
  videoQueue,
  isVideoPlaying,
  setIsVideoPlaying,
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
  // eslint-disable-next-line no-undef
  const [isGreetingVideoEnded, setIsGreetingVideoEnded] = useState(false);
  const [videoSource, setVideoSource] = useState('');
  const [videoTemplate, setVideoTemplate] = useState('');
  const videoPlayer = React.useRef(null);
  useEffect(() => {
    if (videoQueue.current.length > 0) {
      // MediaStream
      const src = videoQueue.current.shift();
      console.info('videoQueue pop: ', src);
      videoPlayer.current.loop = false;
      setVideoSource(src);
      videoPlayer.current.play();
    }
  }, [isVideoPlaying]);

  useEffect(() => {
    if (videoPlayer.current !== null) {
      videoPlayer.current.load();
    }
  }, [videoSource]);
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

    setVideoSource(paramSelectedCharacter.greeting_video);
    setVideoTemplate(paramSelectedCharacter.video_template);

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
          <span></span>
        ) : null}
      </p>

      <div className={`avatar-wrapper ${isPlaying ? 'pulsating-avatar' : ''}`}>
        {selectedCharacter?.avatar_id ? (
          <>{avatarDisplay}</>
        ) : (
          <video
            autoPlay
            id='talking-video'
            ref={videoPlayer}
            className={`speech-video`}
            onPause={event => {
              console.info('onPause: ', event);
              if (!isGreetingVideoEnded) {
                setIsGreetingVideoEnded(true); // Set the flag true after first video ends
              }
              if (videoSource !== videoTemplate) {
                videoPlayer.current.loop = true;
                setVideoSource(videoTemplate);
                setIsVideoPlaying(false);
              }
            }}
            onLoadedMetadata={event => {
              console.info('onLoadedMetadata: ', event);
              const beforeIsRecording = isRecording;
              handleStopCall();
              const duration = event.target.duration;
              setTimeout(() => {
                if (beforeIsRecording) {
                  handleContinueCall();
                }
              }, duration * 1000);
            }}
            onLoadStart={event => {
              console.info('onLoadStart: ', event);
            }}
            onLoadedData={event => {
              console.info('onLoadedData: ', event);
            }}
          >
            <source src={videoSource} type='video/mp4'></source>
          </video>
        )}
      </div>

      <div
        className='main-screen'
        style={{ display: isCallView ? 'flex' : 'none' }}
      >
        <CallView
          isGreetingVideoEnded={isGreetingVideoEnded}
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
          isRecording={isRecording}
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
