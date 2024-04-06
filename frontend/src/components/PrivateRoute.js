// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Element, ...rest }) => {
  const ownerAccount = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // Admin's address
  const isAdmin = localStorage.getItem('isAdmin'); // Check if user is admin (you can implement this logic)

  // If user is not an admin, redirect to login
  if (!isAdmin || ownerAccount.toLowerCase() !== isAdmin.toLowerCase()) {
    return <Navigate to="/login" />;
  }

  return <Element {...rest} />;
};

export default PrivateRoute;
