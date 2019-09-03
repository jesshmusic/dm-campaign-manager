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
  <Nav.Item>
    <Link
      {...props}
      getProps={({ isCurrent }) => ({ className: isCurrent ? 'nav-link active' : 'nav-link' })}
    />
  </Nav.Item>
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
    <Navbar bg="primary" variant="dark" expand="lg" className={'p-0 shadow'}>
      <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="/">DM's Campaign Manager</a>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavLink to={'/'}>Home</NavLink>
          {user ? <NavLink to={'/app/campaigns'}>My Campaigns</NavLink> : null}
          <NavDropdown title="Reference" id="reference-nav-dropdown">
            <DropdownLink to={'/app/classes'}>Classes</DropdownLink>
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
            <Nav.Item>
              <Nav.Link href="/users/sign_in">Sign In</Nav.Link>
            </Nav.Item>
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