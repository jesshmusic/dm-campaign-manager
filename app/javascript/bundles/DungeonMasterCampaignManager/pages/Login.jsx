/**
 * Created by jesshendricks on 2019-08-20
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import PageContainer from '../containers/PageContainer';
import rest from '../actions/api';

const Login = (props) => {
  const {user, flashMessages, loginUser} = props;

  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleUserLogin = (event) => {
    event.preventDefault();
    loginUser(email, password);
  };

  return (
    <PageContainer user={user} flashMessages={flashMessages} pageTitle={'Login'}>
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" onChange={handleEmailChange} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" onChange={handlePasswordChange} />
        </Form.Group>
        <Form.Group controlId="formBasicChecbox">
          <Form.Check type="checkbox" label="Check me out" />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={handleUserLogin}>
          Submit
        </Button>
      </Form>
    </PageContainer>
  );
};

Login.propTypes = {
  user: PropTypes.any,
  flashMessages: PropTypes.array,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    nonPlayerCharacters: state.nonPlayerCharacters,
    playerCharacters: state.playerCharacters,
    dungeonMasters: state.dungeonMasters,
    user: state.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    loginUser: (email, password) => {
      dispatch(rest.actions.userLogin({}, {body: JSON.stringify({user: {email, password}})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);