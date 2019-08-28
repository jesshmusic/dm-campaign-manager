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

const NavLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({ className: isCurrent ? 'nav-link active' : 'nav-link' })}
  />
);

const DropdownLink = props => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({ className: isCurrent ? 'dropdown-item active' : 'dropdown-item' })}
  />
);

function MenuBar (props) {
  const {user, logoutUser} = props;

  const handleLogout = (event) => {
    event.preventDefault();
    logoutUser();
  };
  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Navbar.Brand href="/">DMCM</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavLink to={'/'}>Home</NavLink>
          <NavLink to={'/app/campaigns'}>Campaigns</NavLink>
          <NavDropdown title="Reference" id="basic-nav-dropdown">
            <DropdownLink to={'/app/monsters'}>Monsters</DropdownLink>
            <DropdownLink to={'/app/items'}>Items and Equipment</DropdownLink>
            <DropdownLink to={'/app/spells'}>Spells</DropdownLink>
          </NavDropdown>
          {user && user.role === 'admin' ? (
            <Nav.Item>
              <Nav.Link href="/v1/dashboard">Admin Dashboard</Nav.Link>
            </Nav.Item>
          ) : null}
          {user ? (
            <Button onClick={handleLogout} variant="primary" size="sm">Sign Out</Button>
          ) : (
            <NavLink to={'/app/login'}>Sign In</NavLink>
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
    user: state.users.user,
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