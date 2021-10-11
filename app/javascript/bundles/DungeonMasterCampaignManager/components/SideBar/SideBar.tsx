import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import { UserProps } from '../../utilities/types';
import {
  AiOutlineHome,
  BiLogIn,
  BiLogOut,
  GiCapeArmor,
  GiChestArmor,
  GiDwarfFace,
  GiHomeGarage,
  GiHorseHead,
  GiMagicAxe,
  GiMagicPalm,
  GiMagicPotion,
  GiMonsterGrasp,
  GiOrcHead,
  GiPerson,
  GiRuleBook,
  GiSwapBag,
  GiSwordArray,
  GiToolbox,
} from 'react-icons/all';
import { NavLink, NavLinkSmall } from '../NavLink/NavLink';
import gsap from 'gsap';

const styles = require('./sidebar.module.scss');

const SideBar = (props: {
  user: UserProps;
  logoutUser: () => void;
  getSections: () => void;
  sections: { name: string; slug: string }[];
}) => {
  const { user, logoutUser, getSections, sections } = props;
  const [isShowingRules, setIsShowingRules] = React.useState(false);

  React.useEffect(() => {
    getSections();
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    logoutUser();
  };

  const handleRulesMenu = () => {
    setIsShowingRules(!isShowingRules);
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
      <NavLink to={'/'} icon={<AiOutlineHome />} showActiveIcon>
        Home
      </NavLink>
      <NavLink to={'/app/classes'} icon={<GiPerson />} showActiveIcon>
        Classes
      </NavLink>
      <NavLink to={'/app/races'} icon={<GiDwarfFace />} showActiveIcon>
        Races
      </NavLink>
      <NavLink to={'/app/monsters'} icon={<GiMonsterGrasp />} showActiveIcon>
        Monsters
      </NavLink>
      <NavLink to={'/app/spells'} icon={<GiMagicPalm />} showActiveIcon>
        Spells
      </NavLink>
      <button className={styles.navLink} onClick={handleRulesMenu}>
        <span>
          <GiRuleBook />
          &nbsp;Rules
        </span>
      </button>
      <div
        className={styles.rulesSection}
        style={{ height: isShowingRules ? '100%' : '0' }}
      >
        {sections.map((section, index) => (
          <NavLinkSmall
            to={`/app/sections/${section.slug}`}
            key={`section-${index}`}
            showActiveIcon
          >
            {section.name}
          </NavLinkSmall>
        ))}
      </div>
      <div className={styles.divider}>Items and Equipment</div>
      <NavLinkSmall
        to={`/app/items/armor`}
        icon={<GiCapeArmor />}
        showActiveIcon
      >
        Armor
      </NavLinkSmall>
      <NavLinkSmall to={`/app/items/gear`} icon={<GiSwapBag />} showActiveIcon>
        Adventuring Gear
      </NavLinkSmall>
      <NavLinkSmall
        to={`/app/items/magic-items`}
        icon={<GiMagicPotion />}
        showActiveIcon
      >
        Magic Items
      </NavLinkSmall>
      <NavLinkSmall
        to={`/app/items/magic-armor`}
        icon={<GiChestArmor />}
        showActiveIcon
      >
        Magic Armor
      </NavLinkSmall>
      <NavLinkSmall
        to={`/app/items/magic-weapons`}
        icon={<GiMagicAxe />}
        showActiveIcon
      >
        Magic Weapons
      </NavLinkSmall>
      <NavLinkSmall
        to={`/app/items/vehicles`}
        icon={<GiHorseHead />}
        showActiveIcon
      >
        Mounts & Vehicles
      </NavLinkSmall>
      <NavLinkSmall to={`/app/items/tools`} icon={<GiToolbox />} showActiveIcon>
        Tools
      </NavLinkSmall>
      <NavLinkSmall
        to={`/app/items/weapons`}
        icon={<GiSwordArray />}
        showActiveIcon
      >
        Weapons
      </NavLinkSmall>
      <div className={styles.divider}>User</div>
      {user && user.role === 'admin' ? (
        <NavLink to={'/admin'} icon={<GiHomeGarage />} showActiveIcon>
          Admin
        </NavLink>
      ) : null}
      {user ? (
        <>
          <NavLink
            to={'/app/monster-generator'}
            icon={<GiOrcHead />}
            showActiveIcon
          >
            Monster Generator
          </NavLink>
          <a onClick={handleLogout} className={styles.navLink}>
            <span>
              <BiLogOut />
              &nbsp;Sign Out
            </span>
          </a>
        </>
      ) : (
        <button
          className={styles.navLink}
          data-bs-toggle="modal"
          data-bs-target="#userSigninModal"
        >
          <span>
            <BiLogIn />
            &nbsp;Sign In
          </span>
        </button>
      )}
    </nav>
  );
};

function mapStateToProps(state) {
  return {
    sections: state.sections.sections,
    user: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    logoutUser: () => {
      dispatch(rest.actions.userLogout());
    },
    getSections: () => {
      dispatch(rest.actions.getSections());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
