import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GreetingVideo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const video = document.getElementById('greetingVideo');
    video.onended = () => {
      navigate('/select-character');
    };
  }, [navigate]);

  return (
    <div className='video-container'>
      <video id='greetingVideo' width='100%' height='auto' autoPlay muted>
        <source
          src='https://storage.googleapis.com/avatars_bucket/signin.mp4'
          type='video/mp4'
        />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default GreetingVideo;
