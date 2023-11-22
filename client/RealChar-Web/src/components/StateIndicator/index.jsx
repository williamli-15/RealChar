import React from 'react';
import Avatar from '@mui/material/Avatar';
import { green, red, grey } from '@mui/material/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';

const StatusIndicator = ({ status }) => {
  let avatarColor, icon;

  switch (status) {
    case 'success':
      avatarColor = green[500];
      icon = <CheckCircleIcon />;
      break;
    case 'error':
      avatarColor = red[500];
      icon = <CancelIcon />;
      break;
    default:
      avatarColor = grey[500];
      icon = <PendingIcon />;
  }

  return (
    <Avatar id='state-indicator' sx={{ backgroundColor: avatarColor }}>
      {icon}
    </Avatar>
  );
};

export default StatusIndicator;
