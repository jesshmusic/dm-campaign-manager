import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from '@reach/router';

const ProtectedRoute = ({ as: Component, ...props }) => {
  const { ...rest } = props;
  return props.user ? (
    <Component {...rest} />
  ) : (
    <Redirect from="" to="/" noThrow />
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
  };
}

export default connect(mapStateToProps)(ProtectedRoute);
