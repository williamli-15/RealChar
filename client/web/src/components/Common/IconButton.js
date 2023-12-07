/**
 * src/components/Common/IconButton.jsx
 * A general-purpose Icon Button component
 *
 * created by Lynchee on 7/19/23
 */

import React from 'react';
import './styles.css';

const IconButton = ({
  Icon,
  className,
  onClick,
  bgcolor = 'default',
  disabled = false,
  textLabel,
  textColor = 'white', // Default text color set to white
}) => {
  return (
    <div
      className={`icon-button ${className} ${bgcolor} ${
        disabled ? 'disabled' : ''
      }`}
      onClick={disabled ? null : onClick}
    >
      {textLabel ? (
        <span className='icon-text' style={{ color: textColor }}>
          {textLabel}
        </span>
      ) : (
        <Icon className='icon-instance-node-small' />
      )}
    </div>
  );
};

export default IconButton;
