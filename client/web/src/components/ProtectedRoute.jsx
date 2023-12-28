// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ isLoggedIn, children }) => {
  if (!isLoggedIn.current) {
    return <Navigate to='/sign-in' />;
  }

  return children;
};

export default ProtectedRoute;
