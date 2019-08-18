import React from 'react';
import PropTypes from 'prop-types';

import styles from './navbar.module.scss';

const Navbar = ({ user }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <a className="navbar-brand" href="#">DMCM</a>
    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"/>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
      <ul className="navbar-nav">
        {user && user.role === 'admin' ? (
          <li className="nav-item">
            <a className="nav-link" href="/v1/dashboard">Admin</a>
          </li>
        ) : null}
        {user ? (
          <li className="nav-item">
            <a className="nav-link" href={`/users/${user.username}/edit`}>{user.name}</a>
          </li>
        ) : (
          <li className="nav-item">
            <a className="nav-link" href="/users/sign_in">Log In</a>
          </li>
        )}
        {!user ? (
          <li className="nav-item">
            <a className="nav-link" href="/users/sign_up">Sign Up</a>
          </li>
        ) : null}
      </ul>
    </div>
  </nav>
);

Navbar.propTypes = {
  user: PropTypes.object,
};

export default Navbar;
