import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = ({ as: Component, requireAdmin: boolean, ...props }) => {
  const { requireAdmin, ...rest } = props;
  const { isAuthenticated, user } = useAuth0();
  console.log(user);
  let location = useLocation();
  if (requireAdmin && user && isAuthenticated) {
    return user.role === 'admin' ? (
      <Component {...rest} />
    ) : (
      <Navigate to="/" state={{ from: location }} />
    );
  }
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};

export default ProtectedRoute;
