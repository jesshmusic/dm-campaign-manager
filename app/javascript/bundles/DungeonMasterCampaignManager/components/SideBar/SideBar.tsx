import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { AiOutlineHome } from 'react-icons/ai';
import { BiHide, BiLogIn, BiLogOut, BiShow } from 'react-icons/bi';
import {
  GiAchillesHeel,
  GiBookPile,
  GiBookshelf,
  GiBookStorm,
  GiBurningBook,
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
  GiRuleBook,
  GiSecretBook,
  GiSpellBook,
  GiSwapBag,
  GiSwordArray,
  GiToolbox,
} from 'react-icons/gi';
import PatreonIcon from '../icons/PatreonIcon';

const PATREON_URL =
  'https://patreon.com/DormanLakely?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink';

const ruleBooks = [
  <GiRuleBook key="rule-book" />,
  <GiBookPile key="book-pile" />,
  <GiBurningBook key="burning-book" />,
  <GiSecretBook key="secret-book" />,
  <GiSpellBook key="spell-book" />,
  <GiBookStorm key="book-storm" />,
];

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { SidebarLink, SidebarButton } from '../NavLink/NavLink';
import { useAuth0 } from '@auth0/auth0-react';
import { UserProps } from '../../utilities/types';
import { useLocation } from 'react-router-dom';

import sidebarBG from './SidebarBackground.jpg';

import {
  SidebarWrapper,
  StyledFooter,
  UserWelcome,
  RoleLabel,
  menuItemStyles,
} from './SideBar.styles';

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
  rules: { name: string; slug: string; rules?: { name: string; slug: string }[] }[];
  setIsCollapsed: (collapsed: boolean) => void;
}) => {
  const { currentUser, getRules, isCollapsed, isMobile, logOutUser, rules, setIsCollapsed } = props;

  const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();

  // Determine if submenus should be open based on current path
  const isItemsPath = location.pathname.startsWith('/app/items');
  const isRulesPath = location.pathname.startsWith('/app/rules');

  // Controlled state for submenus - initialized based on current path
  const [itemsOpen, setItemsOpen] = React.useState(isItemsPath);
  const [rulesOpen, setRulesOpen] = React.useState(isRulesPath);

  // Update submenu state when path changes
  React.useEffect(() => {
    if (isItemsPath) setItemsOpen(true);
    if (isRulesPath) setRulesOpen(true);
  }, [location.pathname]);

  const handleLogout = () => {
    getAccessTokenSilently()
      .then((token) => {
        logOutUser(token);
        document.cookie =
          '_dungeon_master_screen_online_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        logout({ logoutParams: { returnTo: window.location.origin } });
      })
      .catch((err) => {
        console.error(err);
      });
  };

  React.useEffect(() => {
    getRules();
  }, []);

  return (
    <SidebarWrapper>
      <Sidebar
        collapsed={isCollapsed}
        image={sidebarBG}
        backgroundColor="rgba(87, 26, 16, 0.3)"
        width="15rem"
        collapsedWidth="5rem"
        rootStyles={{
          borderRight: '0.25rem solid #c9ad6a',
          height: '100vh',
          position: 'fixed',
          top: 0,
        }}
      >
        <Menu menuItemStyles={menuItemStyles}>
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
          <SubMenu
            label="Rules"
            icon={<GiBookshelf />}
            open={rulesOpen}
            onOpenChange={setRulesOpen}
            style={{
              borderBottom: '0.125rem solid #c9ad6a',
            }}
          >
            {rules.map((rule, index) => (
              <SubMenu
                key={`rule-${rule.slug}-${index}`}
                label={rule.name}
                icon={index < 6 ? ruleBooks[index] : <GiRuleBook />}
                style={{ border: 0 }}
              >
                <SidebarLink
                  key={`rulesTop-${index}`}
                  to={`/app/rules/${rule.slug}`}
                  title={rule.name}
                />
                {rule.rules &&
                  rule.rules.map((subrule, subIndex) => (
                    <SidebarLink
                      key={`rulesInner-${subIndex}`}
                      to={`/app/rules/${subrule.slug}`}
                      title={subrule.name}
                    />
                  ))}
              </SubMenu>
            ))}
          </SubMenu>
          <SubMenu
            label="Items & Equipment"
            icon={<GiSwapBag />}
            open={itemsOpen}
            onOpenChange={setItemsOpen}
            style={{
              borderBottom: '0.125rem solid #c9ad6a',
              borderTop: '0.125rem solid #c9ad6a',
              marginTop: '-.125rem',
            }}
          >
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

        <StyledFooter>
          <UserWelcome>
            {isAuthenticated && user ? `Welcome, ${user.given_name}` : 'User'}
            {currentUser && currentUser.role && <RoleLabel>{currentUser.role}</RoleLabel>}
          </UserWelcome>
          <Menu menuItemStyles={menuItemStyles}>
            <SidebarLink
              to="/app/monster-generator"
              title="Monster Generator"
              icon={<GiEvilMinion />}
            />
            {currentUser && currentUser.role === 'admin' ? (
              <SidebarLink to="/app/admin-dashboard" title="Admin" icon={<GiKing />} />
            ) : null}
            <MenuItem
              icon={<PatreonIcon />}
              component={<a href={PATREON_URL} target="_blank" rel="noopener noreferrer" />}
            >
              Support on Patreon
            </MenuItem>
            {isAuthenticated && user ? (
              <>
                <SidebarLink
                  to="/app/user-dashboard"
                  title="User Dashboard"
                  icon={<GiDungeonGate />}
                />
                <MenuItem icon={<BiLogOut />} onClick={handleLogout}>
                  Log Out
                </MenuItem>
              </>
            ) : (
              <MenuItem icon={<BiLogIn />} onClick={() => loginWithRedirect()}>
                Log In
              </MenuItem>
            )}
          </Menu>
        </StyledFooter>
      </Sidebar>
    </SidebarWrapper>
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
