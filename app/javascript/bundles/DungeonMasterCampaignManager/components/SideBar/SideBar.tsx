import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import { UserProps } from '../../utilities/types';
import { Link } from '@reach/router';
import { GiArchiveResearch } from 'react-icons/all';

const styles = require('./sidebar.module.scss');

const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent ? styles.navLinkActive : styles.navLink,
    })}
  />
);

const SideBar = (props: { user: UserProps; logoutUser: () => void }) => {
  const { user, logoutUser } = props;

  const handleLogout = (event) => {
    event.preventDefault();
    logoutUser();
  };

  return (
    <nav className={styles.sideBar}>
      <form className="d-flex pt-5">
        <div className={styles.searchBar}>
          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            aria-describedby="button-addon2"
          />
          <button type="submit" id="button-addon2">
            <GiArchiveResearch size={30} />
          </button>
        </div>
      </form>
      <NavLink to={'/'}>Home</NavLink>
      <NavLink to={'/app/monster-generator'}>Monster Generator</NavLink>
      <NavLink to={'/app/classes'}>Classes</NavLink>
      <NavLink to={'/app/races'}>Races</NavLink>
      <NavLink to={'/app/monsters'}>Monsters</NavLink>
      <NavLink to={'/app/items'}>Items and Equipment</NavLink>
      <NavLink to={'/app/spells'}>Spells</NavLink>
      {user && user.role === 'admin' ? (
        <NavLink to={'/admin'}>Admin</NavLink>
      ) : null}
      {user ? (
        <a onClick={handleLogout} className={styles.navLink}>
          Sign Out
        </a>
      ) : (
        <button
          className={styles.navLink}
          data-bs-toggle="modal"
          data-bs-target="#userSigninModal"
        >
          Sign In
        </button>
      )}
    </nav>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
