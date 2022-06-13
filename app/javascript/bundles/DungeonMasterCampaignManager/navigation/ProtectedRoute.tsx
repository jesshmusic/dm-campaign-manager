import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import DndSpinner from '../components/DndSpinners/DndSpinner';

const ProtectedRoute = ({ as: Component, requireAdmin: boolean, ...props }) => {
  const { requireAdmin, ...rest } = props;
  const { isAuthenticated, isLoading, user } = useAuth0();
  let location = useLocation();
  if (isLoading) {
    return <DndSpinner />;
  }
  if (requireAdmin && user && isAuthenticated) {
    return user.role === 'admin' ? (
      <Component {...rest} />
    ) : (
      <Navigate to="/" state={{ from: location }} />
    );
  }
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" state={{ from: location }} />;
};

export default ProtectedRoute;
