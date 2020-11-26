import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link } from '@reach/router';
import PropTypes from 'prop-types';
import React from 'react';
import rest from '../../../actions/api';
import {connect} from 'react-redux';

import classes from './menu-bar.module.scss';

const NavLink = props => (
  <Nav.Item className={classes.navItem}>
    <Link
      {...props}
      getProps={({ isCurrent }) => ({ className: isCurrent ? classes.navLinkActive : classes.navLink })}
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
    <Navbar bg="primary" variant="dark" expand="lg" className={classes.navbar}>
      <a className={classes.navbarBrand} href="/app/assets/stylesheets">DM&apos;s Toolbox</a>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <NavLink to={'/'}>Home</NavLink>
          <NavLink to={'/app/npc-generator'}>NPC Generator</NavLink>
          <NavLink to={'/app/names'}>Name Generator</NavLink>
          <NavDropdown title="Reference" id="reference-nav-dropdown" className={classes.dropdown}>
            <DropdownLink to={'/app/classes'}>Classes</DropdownLink>
            <DropdownLink to={'/app/npcs'}>NPCs</DropdownLink>
            <DropdownLink to={'/app/items'}>Items and Equipment</DropdownLink>
            <DropdownLink to={'/app/spells'}>Spells</DropdownLink>
          </NavDropdown>
          {user && user.role === 'admin' ? (
            <Nav.Item className={classes.navItem}>
              <Nav.Link href="/v1/dashboard" className={classes.navLink}>Admin Dashboard</Nav.Link>
            </Nav.Item>
          ) : null}
          <Nav.Item className={classes.navItem}>
            {user && user.role === 'admin' ? (
              <Nav.Link onClick={handleLogout} className={classes.navLink}>Sign Out</Nav.Link>
            ) : null}
          </Nav.Item>
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