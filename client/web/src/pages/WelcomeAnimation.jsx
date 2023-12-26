import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomeAnimation = () => {
  const navigate = useNavigate();
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
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
            navigate('/sign-in');
          }
        }, fadeDelay);
      }
    };
    typingAnimation(0);
  }, [textIndex, navigate]);

  const renderTextWithLineBreaks = text => {
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {index === 0 ? (
          // The first line will inherit styles from .typing-text
          <span>{line}</span>
        ) : (
          // The second line will have its own class .second-line
          <div className='second-line'>{line}</div>
        )}
        {index < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const getMarginLeft = () => {
    // Adjust the value as needed based on your styling
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
    </div>
  );
};

export default WelcomeAnimation;
