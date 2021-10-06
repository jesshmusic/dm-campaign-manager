import React from 'react';
import { Link } from '@reach/router';
import PropTypes from 'prop-types';
import rest from '../../../actions/api';
import { connect } from 'react-redux';
import { UserProps } from '../../../utilities/types';

const classes = require('./menu-bar.module.scss');

export const NavLink = (props) => (
  <li className={`${classes.navItem} nav-item`}>
    <Link
      {...props}
      getProps={({ isCurrent }) => ({
        className: isCurrent
          ? `${props.className} nav-link active ${classes.navLinkActive}`
          : `${props.className} nav-link ${classes.navLink}`
      })}
    />
  </li>
);

function MenuBar(props: { user: UserProps; logoutUser: () => void }) {
  const { user, logoutUser } = props;

  const handleLogout = (event) => {
    event.preventDefault();
    logoutUser();
  };
  return (
    <nav
      className={`navbar navbar-dark bg-primary fixed-top ${classes.navbar}`}
    >
      <div className='container-fluid'>
        <a className={`navbar-brand ${classes.navbarBrand}`} href='#'>
          The Dungeon Master Screen
        </a>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='offcanvas'
          data-bs-target='#offcanvasNavbar'
          aria-controls='offcanvasNavbar'
        >
          <span className='navbar-toggler-icon' />
        </button>
        <div
          className='offcanvas offcanvas-start'
          tabIndex={-1}
          id='offcanvasNavbar'
          aria-labelledby='offcanvasNavbarLabel'
        >
          <div className='offcanvas-header'>
            <h5 className='offcanvas-title' id='offcanvasNavbarLabel'>
              Menu
            </h5>
            <button
              type='button'
              className='btn-close text-reset'
              data-bs-dismiss='offcanvas'
              aria-label='Close'
            />
          </div>
          <div className='offcanvas-body'>
            <ul className='navbar-nav justify-content-end flex-grow-1 pe-3'>
              <NavLink to={'/'}>Home</NavLink>
              <NavLink to={'/app/monster-generator'}>Monster Generator</NavLink>
              <NavLink to={'/app/classes'}>Classes</NavLink>
              <NavLink to={'/app/races'}>Races</NavLink>
              <NavLink to={'/app/monsters'}>Monsters</NavLink>
              <NavLink to={'/app/items'}>Items and Equipment</NavLink>
              <NavLink to={'/app/spells'}>Spells</NavLink>
              {user && user.role === 'admin' ? (
                <NavLink to={'/'}>Home</NavLink>
              ) : null}
              {user ? (
                <li className='nav-item'>
                  <a onClick={handleLogout} className='nav-link'>
                    Sign Out
                  </a>
                </li>
              ) : (
                <li className='nav-item'>
                  <button
                    className='btn btn-link nav-link'
                    data-bs-toggle='modal'
                    data-bs-target='#userSigninModal'
                  >
                    Sign In
                  </button>
                </li>
              )}
            </ul>
            <form className='d-flex pt-5'>
              <input
                className='form-control me-2'
                type='search'
                placeholder='Search'
                aria-label='Search'
              />
              <button className='btn btn-outline-success' type='submit'>
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

MenuBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  user: PropTypes.any
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => {
      dispatch(rest.actions.userLogout());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
