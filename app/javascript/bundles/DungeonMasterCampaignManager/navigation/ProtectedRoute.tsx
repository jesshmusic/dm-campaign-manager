import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import DndSpinner from '../components/DndSpinners/DndSpinner';
import { UserProps } from '../utilities/types';

interface ProtectedRouteProps {
  as: React.ComponentType<{ currentUser?: UserProps } & Record<string, unknown>>;
  requireAdmin?: boolean;
  currentUser?: UserProps;
  [key: string]: unknown;
}

const ProtectedRoute = ({
  as: Component,
  requireAdmin,
  currentUser,
  ...rest
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const location = useLocation();
  if (isLoading) {
    return <DndSpinner />;
  }
  if (requireAdmin && user && isAuthenticated) {
    // Check if user has Admin role from Auth0 custom claim (authoritative, from token)
    // or Redux currentUser (populated from server-verified API response as fallback)
    const roles = (user['https://dm-campaign-manager.appRoles'] as string[]) || [];
    const isAdmin = roles.includes('Admin') || currentUser?.role === 'admin';
    return isAdmin ? (
      <Component currentUser={currentUser} {...rest} />
    ) : (
      <Navigate to="/" state={{ from: location }} />
    );
  }
  return isAuthenticated ? (
    <Component currentUser={currentUser} {...rest} />
  ) : (
    <Navigate to="/" state={{ from: location }} />
  );
};

export default ProtectedRoute;
