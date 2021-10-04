import React from 'react';
import { Link } from '@reach/router';
import PropTypes from 'prop-types';
import rest from '../../../actions/api';
import { connect } from 'react-redux';
import { UserProps } from '../../../utilities/types';

const classes = require('./menu-bar.module.scss');

const NavLink = (props) => (
  <li className={`nav-item ${classes.navItem}`}>
    <Link
      {...props}
      getProps={({ isCurrent }) => ({
        className: isCurrent
          ? `nav-link active ${classes.navLinkActive}`
          : `nav-link ${classes.navLink}`,
      })}
    />
  </li>
);

const DropdownLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent ? 'dropdown-item active' : 'dropdown-item',
    })}
  />
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
      <div className="container-fluid">
        <a className={`navbar-brand ${classes.navbarBrand}`} href="#">
          DM&apos;s Toolbox
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasNavbar"
          aria-controls="offcanvasNavbar"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div
          className="offcanvas offcanvas-end"
          tabIndex={-1}
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="offcanvasNavbarLabel">
              Menu
            </h5>
            <button
              type="button"
              className="btn-close text-reset"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            />
          </div>
          <div className="offcanvas-body">
            <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
              <NavLink to={'/'}>Home</NavLink>
              <NavLink to={'/app/monster-generator'}>Monster Generator</NavLink>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  id="offcanvasNavbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Reference
                </a>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="offcanvasNavbarDropdown"
                >
                  <li>
                    <DropdownLink to={'/app/classes'}>Classes</DropdownLink>
                  </li>
                  <li>
                    {' '}
                    <DropdownLink to={'/app/monsters'}>Monsters</DropdownLink>
                  </li>
                  <li>
                    {' '}
                    <DropdownLink to={'/app/items'}>
                      Items and Equipment
                    </DropdownLink>
                  </li>
                  <li>
                    {' '}
                    <DropdownLink to={'/app/spells'}>Spells</DropdownLink>
                  </li>
                </ul>
              </li>
              {user && user.role === 'admin' ? (
                <NavLink to={'/'}>Home</NavLink>
              ) : null}
              {user ? (
                <li className="nav-item">
                  <a onClick={handleLogout} className="nav-link">
                    Sign Out
                  </a>
                </li>
              ) : (
                <li>
                  <a href="/users/sign_in" className={classes.navLink}>
                    Sign In
                  </a>
                </li>
              )}
            </ul>
            <form className="d-flex">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
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
  user: PropTypes.any,
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => {
      dispatch(rest.actions.userLogout());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuBar);
