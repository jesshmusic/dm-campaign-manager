import AppBar from '@material-ui/core/AppBar/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/core/SvgIcon/SvgIcon';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {Link as RouterLink} from '@reach/router';
import PropTypes from 'prop-types';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import rest from '../../actions/api';
import {connect} from 'react-redux';

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginLeft: 0,
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(6, 0, 2),
  },
  title: {
    flexGrow: 1,
  },
}));


function MenuBar (props) {
  const classes = useStyles();
  const {onClick, user, logoutUser} = props;

  const handleLogout = (event) => {
    event.preventDefault();
    logoutUser();
  };
  return (
    <AppBar className={classes.appBar}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={onClick}
          className={classes.menuButton}
        >
          <MenuIcon/>
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Dungeon Master&apos;s Campaign Manager
        </Typography>
        {user && user.role === 'admin' ? (
          <Button color="inherit" href='/v1/dashboard'>Admin</Button>
        ) : null}
        {user ? (
          <Button color="inherit" onClick={handleLogout}>Log Out</Button>
        ) : (
          <Button color="inherit" component={RouterLink} to='/login'>Log In</Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

MenuBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  user: PropTypes.any,
};

function mapStateToProps (state) {
  return {
    user: state.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    logoutUser: () => {
      dispatch(rest.actions.userLogout());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
