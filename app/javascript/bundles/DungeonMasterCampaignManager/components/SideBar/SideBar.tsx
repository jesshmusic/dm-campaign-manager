import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';
import {
  AiOutlineHome,
  BiLogIn,
  BiLogOut,
  GiAchillesHeel,
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
import { useAuth0, User } from '@auth0/auth0-react';

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
  isCollapsed: boolean;
  getSections: () => void;
  sections: { name: string; slug: string }[];
  setUser: (user: User, token: string) => void;
}) => {
  const { isCollapsed, getSections, sections, setUser } = props;

  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
    getAccessTokenSilently
  } = useAuth0();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      getAccessTokenSilently()
        .then((token) => {
          setUser(user, token);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  React.useEffect(() => {
    getSections();
  }, []);

  return (
    <>
      <ProSidebar collapsed={isCollapsed} image={sidebarBG}>
        <SidebarContent>
          <Menu iconShape='square'>
            <SidebarLink to='/' title='Home' icon={<AiOutlineHome />} />
            <SidebarLink
              to='/app/classes'
              title='Classes'
              icon={<GiPerson />}
            />
            <SidebarLink to='/app/races' title='Races' icon={<GiDwarfFace />} />
            <SidebarLink
              to='/app/monsters'
              title='Monsters'
              icon={<GiMonsterGrasp />}
            />
            <SidebarLink
              to='/app/spells'
              title='Spells'
              icon={<GiMagicPalm />}
            />
            <SidebarLink
              to='/app/conditions'
              title='Conditions'
              icon={<GiAchillesHeel />}
            />
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
          <div className={styles.divider}>
            {isAuthenticated && user ? `Welcome, ${user.given_name}` : 'User'}
          </div>
          <Menu>
            {user && user.role === 'admin' ? (
              <SidebarLink
                to='/app/admin'
                title='Admin'
                icon={<GiHomeGarage />}
              />
            ) : null}
            {isAuthenticated && user ? (
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
                  <button
                    onClick={() => logout({ returnTo: window.location.origin })}
                  >
                    Log Out
                  </button>
                </MenuItem>
              </>
            ) : (
              <MenuItem icon={<BiLogIn />}>
                <button onClick={() => loginWithRedirect()}>Log In</button>
              </MenuItem>
            )}
          </Menu>
        </SidebarFooter>
      </ProSidebar>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    sections: state.sections.sections
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getSections: () => {
      dispatch(rest.actions.getSections());
    },
    setUser: (user: User, token: string) => {
      let {
        sub,
        nickname,
        given_name,
        family_name,
        locale,
        picture,
        updated_at,
        email_verified,
        ...userFields
      } = user;
      userFields.auth_id = sub;
      userFields.username = nickname;
      dispatch(
        rest.actions.setUser(
          {},
          {
            body: JSON.stringify({ user: userFields }),
            token
          }
        )
      );
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
