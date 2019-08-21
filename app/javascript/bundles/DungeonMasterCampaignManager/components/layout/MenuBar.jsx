import {Link as RouterLink} from '@reach/router';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Button from 'react-bootstrap/Button';
import { Link } from '@reach/router';
import PropTypes from 'prop-types';
import React from 'react';
import rest from '../../actions/api';
import {connect} from 'react-redux';

function MenuBar (props) {
  const {user, logoutUser} = props;

  const handleLogout = (event) => {
    event.preventDefault();
    logoutUser();
  };
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="/">React-Bootstrap</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Link to={'/'} className={'nav-link'}>Home</Link>
          <Link to={'/campaigns'} className={'nav-link'}>Campaigns</Link>
          <NavDropdown title="Dropdown" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
          </NavDropdown>
          {user ? (
            <Button onClick={handleLogout} variant="link">Sign Out</Button>
          ) : (
            <Link to={'/login'} className={'nav-link'}>Sign In</Link>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

MenuBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
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