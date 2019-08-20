/**
 * Created by jesshendricks on 2019-08-20
 */

import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import PageContainer from '../containers/PageContainer';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import rest from '../actions/api';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: theme.spacing(1),
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    maxWidth: 400,
  },
}));

const Login = (props) => {
  const {user, flashMessages, loginUser} = props;
  const classes = useStyles();

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
      <form>
        <TextField
          id="standard-email-input"
          label="Email"
          className={classes.textField}
          type="email"
          margin="normal"
          onChange={handleEmailChange}
        />
        <TextField
          id="standard-password-input"
          label="Password"
          className={classes.textField}
          type="password"
          margin="normal"
          onChange={handlePasswordChange}
        />
        <Button color="primary" className={classes.button} onClick={handleUserLogin}>
          Login
        </Button>
      </form>
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