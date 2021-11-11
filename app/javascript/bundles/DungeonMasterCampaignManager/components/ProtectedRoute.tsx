import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = ({ as: Component, ...props }) => {
  const { ...rest } = props;
  const { isAuthenticated } = useAuth0();
  let location = useLocation();
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};

export default ProtectedRoute;
