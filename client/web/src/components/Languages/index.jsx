/**
 * src/components/Languages/index.jsx
 * Select a language: currently support English or Spanish
 *
 * created by pycui on 7/28/23
 */

import React from 'react';
import './style.css';

const Languages = ({ preferredLanguage, setPreferredLanguage }) => {
  const languages = [
    'English',
    // 'Spanish',
    // 'French',
    // 'German',
    // 'Hindi',
    // 'Italian',
    // 'Polish',
    // 'Portuguese',
    // 'Chinese',
    // 'Japanese',
    // 'Korean',
    'More coming soon!',
  ];

  return (
    <div className='languages-container'>
      <label className='languages-label'>I want to learn...</label>
      <select
        className='select'
        value={preferredLanguage}
        onChange={e => setPreferredLanguage(e.target.value)}
      >
        <option disabled value=''>
          Select Language
        </option>
        {languages.map((language, index) => (
          <option
            key={index}
            value={language}
            disabled={language === 'More coming soon!'}
          >
            {language}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Languages;
