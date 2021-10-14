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
  GiPerson,
  GiRuleBook,
  GiSwapBag,
  GiSwordArray,
  GiToolbox
} from 'react-icons/all';

import { Menu, MenuItem, ProSidebar, SidebarContent, SidebarFooter, SubMenu } from 'react-pro-sidebar';
import './sidebar-vars.scss';
import { SidebarLink } from '../NavLink/NavLink';

const sidebarBG = require('./SidebarBackground.jpg');

const styles = require('./sidebar.module.scss');

const itemTypes = [
  { name: 'Armor', link: '/app/items/armor', icon: <GiCapeArmor /> },
  { name: 'Weapons', link: '/app/items/weapons', icon: <GiSwordArray /> },
  { name: 'Adventuring Gear', link: '/app/items/gear', icon: <GiSwapBag /> },
  {
    name: 'Mounts & Vehicles',
    link: '/app/items/vehicles',
    icon: <GiHorseHead />
  },
  { name: 'Tools', link: '/app/items/tools', icon: <GiToolbox /> },
  {
    name: 'Magic Items',
    link: '/app/items/magic-items',
    icon: <GiMagicPotion />
  },
  {
    name: 'Magic Armor',
    link: '/app/items/magic-armor',
    icon: <GiChestArmor />
  },
  {
    name: 'Magic Weapons',
    link: '/app/items/magic-weapons',
    icon: <GiMagicAxe />
  }
];

const SideBar = (props: {
  user: UserProps;
  isCollapsed: boolean;
  logoutUser: () => void;
  getSections: () => void;
  sections: { name: string; slug: string }[];
}) => {
  const { user, logoutUser, isCollapsed, getSections, sections } = props;

  React.useEffect(() => {
    getSections();
  }, []);

  const handleLogout = (event) => {
    event.preventDefault();
    logoutUser();
  };

  return (
    <ProSidebar collapsed={isCollapsed} image={sidebarBG}>
      <SidebarContent>
        <Menu iconShape='square'>
          <SidebarLink to='/' title='Home' icon={<AiOutlineHome />} />
          <SidebarLink to='/app/classes' title='Classes' icon={<GiPerson />} />
          <SidebarLink to='/app/races' title='Races' icon={<GiDwarfFace />} />
          <SidebarLink
            to='/app/monsters'
            title='Monsters'
            icon={<GiMonsterGrasp />}
          />
          <SidebarLink to='/app/spells' title='Spells' icon={<GiMagicPalm />} />
          <SubMenu title='Rules' icon={<GiRuleBook />}>
            {sections.map((section, index) => (
              <SidebarLink
                key={`rules-${index}`}
                to={`/app/sections/${section.slug}`}
                title={section.name}
              />
            ))}
          </SubMenu>
          <SubMenu title='Items & Equipment' icon={<GiSwapBag />}>
            {itemTypes.map((itemType, index) => (
              <SidebarLink
                key={`items-${index}`}
                to={itemType.link}
                title={itemType.name}
                icon={itemType.icon}
              />
            ))}
          </SubMenu>
        </Menu>
      </SidebarContent>
      <SidebarFooter>
        <div className={styles.divider}>User</div>
        <Menu>
          {user && user.role === 'admin' ? (
            <SidebarLink
              to='/app/admin'
              title='Admin'
              icon={<GiHomeGarage />}
            />
          ) : null}
          {user ? (
            <>
              <SidebarLink
                to='/app/monster-generator'
                title='Monster Generator'
                icon={<GiHomeGarage />}
              />
              <SidebarLink
                to='/app/admin'
                title='Admin'
                icon={<GiHomeGarage />}
              />
              <MenuItem icon={<BiLogOut />}>
                <a onClick={handleLogout}>
                  Sign Out
                </a>
              </MenuItem>
            </>
          ) : (
            <MenuItem icon={<BiLogIn />}>
              <button
                data-bs-toggle='modal'
                data-bs-target='#userSigninModal'
              >
                Sign In
              </button>
            </MenuItem>
          )}
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  );
};

const mapStateToProps = (state) => {
  return {
    sections: state.sections.sections,
    user: state.users.currentUser
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: () => {
      dispatch(rest.actions.userLogout());
    },
    getSections: () => {
      dispatch(rest.actions.getSections());
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
