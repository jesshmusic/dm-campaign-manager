import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import { UserProps } from '../../utilities/types';
import { Link } from '@reach/router';
import { GiDragonHead } from 'react-icons/all';

const styles = require('./sidebar.module.scss');

export const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent ? styles.navLinkActive : styles.navLink
    })}
  />
);

const NavLinkSmall = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent ? styles.navLinkSmallActive : styles.navLinkSmall
    })}
  />
);

const SideBar = (props: {
  user: UserProps;
  logoutUser: () => void;
  getSections: () => void;
  sections: { name: string; slug: string }[];
}) => {
  const { user, logoutUser, getSections, sections } = props;

  React.useEffect(() => {
    getSections();
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    logoutUser();
  };

  return (
    <nav className={styles.sideBar}>
      {/*<form className="d-flex pt-5">*/}
      {/*  <div className={styles.searchBar}>*/}
      {/*    <input*/}
      {/*      type="search"*/}
      {/*      placeholder="Search"*/}
      {/*      aria-label="Search"*/}
      {/*      aria-describedby="button-addon2"*/}
      {/*    />*/}
      {/*    <button type="submit" id="button-addon2">*/}
      {/*      <GiArchiveResearch size={30} />*/}
      {/*    </button>*/}
      {/*  </div>*/}
      {/*</form>*/}
      <NavLink to={'/'}>
        Home <GiDragonHead />
      </NavLink>
      <NavLink to={'/app/classes'}>
        Classes <GiDragonHead />
      </NavLink>
      <NavLink to={'/app/races'}>
        Races <GiDragonHead />
      </NavLink>
      <NavLink to={'/app/monsters'}>
        Monsters <GiDragonHead />
      </NavLink>
      <NavLink to={'/app/spells'}>
        Spells <GiDragonHead />
      </NavLink>
      <div className={styles.divider}>Items and Equipment</div>
      <NavLinkSmall to={`/app/items/armor`}>
        Armor <GiDragonHead />
      </NavLinkSmall>
      <NavLinkSmall to={`/app/items/gear`}>
        Adventuring Gear <GiDragonHead />
      </NavLinkSmall>
      <NavLinkSmall to={`/app/items/magic-items`}>
        Magic Items <GiDragonHead />
      </NavLinkSmall>
      <NavLinkSmall to={`/app/items/magic-armor`}>
        Magic Armor <GiDragonHead />
      </NavLinkSmall>
      <NavLinkSmall to={`/app/items/magic-weapons`}>
        Magic Weapons <GiDragonHead />
      </NavLinkSmall>
      <NavLinkSmall to={`/app/items/vehicles`}>
        Mounts & Vehicles <GiDragonHead />
      </NavLinkSmall>
      <NavLinkSmall to={`/app/items/tools`}>
        Tools <GiDragonHead />
      </NavLinkSmall>
      <NavLinkSmall to={`/app/items/weapons`}>
        Weapons <GiDragonHead />
      </NavLinkSmall>
      <div className={styles.divider}>Rules</div>
      {sections.map((section) => (
        <NavLinkSmall to={`/app/sections/${section.slug}`}>
          {section.name} <GiDragonHead />
        </NavLinkSmall>
      ))}
      <div className={styles.divider}>User</div>
      {user && user.role === 'admin' ? (
        <NavLink to={'/admin'}>
          Admin <GiDragonHead />
        </NavLink>
      ) : null}
      {user ? (
        <>
          <NavLink to={'/app/monster-generator'}>
            Monster Generator <GiDragonHead />
          </NavLink>
          <a onClick={handleLogout} className={styles.navLink}>
            Sign Out
          </a>
        </>
      ) : (
        <button
          className={styles.navLink}
          data-bs-toggle='modal'
          data-bs-target='#userSigninModal'
        >
          Sign In
        </button>
      )}
    </nav>
  );
};

function mapStateToProps(state) {
  return {
    sections: state.sections.sections,
    user: state.users.currentUser
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => {
      dispatch(rest.actions.userLogout());
    },
    getSections: () => {
      dispatch(rest.actions.getSections());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
