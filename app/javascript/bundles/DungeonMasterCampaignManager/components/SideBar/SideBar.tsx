import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';
import {
  AiOutlineHome,
  BiHide,
  BiLogIn,
  BiLogOut,
  BiShow,
  GiAchillesHeel, GiBookPile,
  GiBookshelf, GiBookStorm, GiBurningBook,
  GiCapeArmor,
  GiChestArmor,
  GiDungeonGate,
  GiDwarfFace,
  GiEvilMinion,
  GiHorseHead,
  GiKing,
  GiMagicAxe,
  GiMagicPalm,
  GiMagicPotion,
  GiMonsterGrasp,
  GiPerson,
  GiRuleBook, GiSecretBook, GiSpellBook,
  GiSwapBag,
  GiSwordArray,
  GiToolbox
} from 'react-icons/all';

const ruleBooks = [
  <GiRuleBook />,
  <GiBookPile />,
  <GiBurningBook />,
  <GiSecretBook />,
  <GiSpellBook />,
  <GiBookStorm />
]

import {
  Menu,
  MenuItem,
  ProSidebar,
  SidebarContent,
  SidebarFooter,
  SubMenu,
} from 'react-pro-sidebar';
import './sidebar-vars.scss';
import { SidebarButton, SidebarLink } from '../NavLink/NavLink';
import { useAuth0 } from '@auth0/auth0-react';
import { UserProps } from '../../utilities/types';

const sidebarBG = require('./SidebarBackground.jpg');

const styles = require('./sidebar.module.scss');

const itemTypes = [
  { name: 'Armor', link: '/app/items/armor', icon: <GiCapeArmor /> },
  { name: 'Weapons', link: '/app/items/weapons', icon: <GiSwordArray /> },
  { name: 'Adventuring Gear', link: '/app/items/gear', icon: <GiSwapBag /> },
  {
    name: 'Mounts & Vehicles',
    link: '/app/items/vehicles',
    icon: <GiHorseHead />,
  },
  { name: 'Tools', link: '/app/items/tools', icon: <GiToolbox /> },
  {
    name: 'Magic Items',
    link: '/app/items/magic-items',
    icon: <GiMagicPotion />,
  },
  {
    name: 'Magic Armor',
    link: '/app/items/magic-armor',
    icon: <GiChestArmor />,
  },
  {
    name: 'Magic Weapons',
    link: '/app/items/magic-weapons',
    icon: <GiMagicAxe />,
  },
];

const SideBar = (props: {
  currentUser?: UserProps;
  getRules: () => void;
  isCollapsed: boolean;
  isMobile: boolean;
  logOutUser: (token: string) => void;
  rules: { name: string; slug: string, rules?: {name: string, slug: string}[] }[];
  setIsCollapsed: (boolean) => void;
}) => {
  const { currentUser, getRules, isCollapsed, isMobile, logOutUser, rules, setIsCollapsed } =
    props;

  const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();

  const handleLogout = () => {
    getAccessTokenSilently()
      .then((token) => {
        logOutUser(token);
        document.cookie =
          '_dungeon_master_screen_online_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        logout({ returnTo: window.location.origin });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    getRules();
  }, []);

  return (
    <>
      <ProSidebar collapsed={isCollapsed} image={sidebarBG}>
        <SidebarContent>
          <Menu iconShape="square">
            {!isMobile && (
              <SidebarButton
                onClick={() => {
                  setIsCollapsed(!isCollapsed);
                }}
                title={isCollapsed ? 'Show Menu' : 'Collapse Menu'}
                icon={isCollapsed ? <BiShow /> : <BiHide />}
              />
            )}
            <SidebarLink to="/" title="Dashboard" icon={<AiOutlineHome />} />
            <SidebarLink to="/app/classes" title="Classes" icon={<GiPerson />} />
            <SidebarLink to="/app/races" title="Races" icon={<GiDwarfFace />} />
            <SidebarLink to="/app/monsters" title="Monsters" icon={<GiMonsterGrasp />} />
            <SidebarLink to="/app/spells" title="Spells" icon={<GiMagicPalm />} />
            <SidebarLink to="/app/conditions" title="Conditions" icon={<GiAchillesHeel />} />
            <SubMenu title="Rules" icon={<GiBookshelf />}>
              {rules.map((rule, index) => (
                <SubMenu title={rule.name} icon={index < 6 ? ruleBooks[index] : <GiRuleBook />}>
                  <SidebarLink
                    key={`rulesTop-${index}`}
                    to={`/app/rules/${rule.slug}`}
                    title={rule.name}
                  />
                  {rule.rules && rule.rules.map((subrule, subIndex) => (
                    <SidebarLink
                      key={`rulesInner-${subIndex}`}
                      to={`/app/rules/${subrule.slug}`}
                      title={subrule.name}
                    />
                  ))}
                </SubMenu>
              ))}
            </SubMenu>
            <SubMenu title="Items & Equipment" icon={<GiSwapBag />} >
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
          <div className={`${styles.divider} ${styles.userName}`}>
            {isAuthenticated && user ? `Welcome, ${user.given_name}` : 'User'}
            {currentUser && currentUser.role && (
              <span className={styles.roleLabel}>{currentUser.role}</span>
            )}
          </div>
          <Menu>
            <SidebarLink
              to="/app/monster-generator"
              title="Monster Generator"
              icon={<GiEvilMinion />}
            />
            {currentUser && currentUser.role === 'admin' ? (
              <SidebarLink to="/app/admin-dashboard" title="Admin" icon={<GiKing />} />
            ) : null}
            {isAuthenticated && user ? (
              <>
                <SidebarLink
                  to="/app/user-dashboard"
                  title="User Dashboard"
                  icon={<GiDungeonGate />}
                />
                <MenuItem icon={<BiLogOut />}>
                  <button onClick={() => handleLogout()}>Log Out</button>
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
    rules: state.rules.rules,
    currentUser: state.users.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logOutUser: (token: string) => {
      dispatch(rest.actions.logout({}, { token }));
    },
    getRules: () => {
      dispatch(rest.actions.getRules());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SideBar);
