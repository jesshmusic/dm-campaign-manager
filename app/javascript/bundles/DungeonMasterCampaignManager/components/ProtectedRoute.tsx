import React from 'react';
import { Redirect } from '@reach/router';
import { useAuth0 } from '@auth0/auth0-react';

const ProtectedRoute = ({ as: Component, ...props }) => {
  const { ...rest } = props;
  const { isAuthenticated } = useAuth0();
  return isAuthenticated ? (
    <Component {...rest} />
  ) : (
    <Redirect from='' to='/' noThrow />
  );
};

export default ProtectedRoute;
