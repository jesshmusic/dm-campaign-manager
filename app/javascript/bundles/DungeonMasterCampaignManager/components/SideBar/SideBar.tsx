import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { AiOutlineHome } from 'react-icons/ai';
import { BiHide, BiLogIn, BiLogOut, BiShow } from 'react-icons/bi';
import {
  GiBookshelf,
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
  GiSecretBook,
  GiSwapBag,
  GiSwordArray,
  GiToolbox,
  GiUpgrade,
} from 'react-icons/gi';
import PatreonIcon from '../icons/PatreonIcon';
import EditionToggle from '../EditionToggle';
import { getIconFromName } from '../../utilities/icons';

const PATREON_URL =
  'https://patreon.com/DormanLakely?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink';

import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { SidebarLink, SidebarButton } from '../NavLink/NavLink';
import { useAuth0 } from '@auth0/auth0-react';
import { UserProps } from '../../utilities/types';
import { useLocation } from 'react-router-dom';
import { useEdition } from '../../contexts/EditionContext';

import sidebarBG from './SidebarBackground.jpg';

import {
  SidebarWrapper,
  StyledFooter,
  UserWelcome,
  RoleLabel,
  menuItemStyles,
} from './SideBar.styles';

type ChildRuleType = {
  name: string;
  slug: string;
  sort_order?: number;
  game_icon?: string;
  rules?: { name: string; slug: string; sort_order?: number; game_icon?: string }[];
};

type RuleType = {
  name: string;
  slug: string;
  category?: string;
  sort_order?: number;
  game_icon?: string;
  rules?: ChildRuleType[];
};

// Sort rules by sort_order, then by name
const sortByOrder = (rules: RuleType[]): RuleType[] => {
  return [...rules].sort((a, b) => {
    // Rules with sort_order come first, sorted by that value
    if (a.sort_order !== undefined && b.sort_order !== undefined) {
      return a.sort_order - b.sort_order;
    }
    if (a.sort_order !== undefined) return -1;
    if (b.sort_order !== undefined) return 1;
    // Otherwise sort alphabetically
    return a.name.localeCompare(b.name);
  });
};

// Helper to get icon for a rule - returns undefined if no icon set
const getRuleIcon = (rule: RuleType | ChildRuleType) => {
  if (rule.game_icon) {
    return getIconFromName(rule.game_icon);
  }
  return undefined;
};

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
  rules: RuleType[];
  setIsCollapsed: (collapsed: boolean) => void;
}) => {
  const { currentUser, getRules, isCollapsed, isMobile, logOutUser, rules, setIsCollapsed } = props;

  const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();
  const { isEdition2024 } = useEdition();

  // In 2024 edition, "Races" are called "Species"
  const racesLabel = isEdition2024 ? 'Species' : 'Races';

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
          <EditionToggle isCollapsed={isCollapsed} />
          <SidebarLink to="/" title="Dashboard" icon={<AiOutlineHome />} />
          <SidebarLink to="/app/classes" title="Classes" icon={<GiPerson />} />
          <SidebarLink to="/app/races" title={racesLabel} icon={<GiDwarfFace />} />
          {isEdition2024 && (
            <>
              <SidebarLink to="/app/backgrounds" title="Backgrounds" icon={<GiSecretBook />} />
              <SidebarLink to="/app/feats" title="Feats" icon={<GiUpgrade />} />
            </>
          )}
          <SidebarLink to="/app/monsters" title="Monsters" icon={<GiMonsterGrasp />} />
          <SidebarLink to="/app/spells" title="Spells" icon={<GiMagicPalm />} />
          <SubMenu
            label="Rules"
            icon={<GiBookshelf />}
            open={rulesOpen}
            onOpenChange={setRulesOpen}
            style={{
              borderBottom: '0.125rem solid #c9ad6a',
            }}
          >
            <SidebarLink to="/app/rules" title="All Rules" icon={<GiBookshelf />} />
            {sortByOrder(rules).map((rule, index) => {
              // If rule has children, show as submenu
              if (rule.rules && rule.rules.length > 0) {
                return (
                  <SubMenu
                    key={`rule-${rule.slug}-${index}`}
                    label={rule.name}
                    icon={getRuleIcon(rule)}
                    style={{ border: 0 }}
                  >
                    <SidebarLink
                      key={`rule-overview-${rule.slug}`}
                      to={`/app/rules/${rule.slug}`}
                      title={rule.name}
                      icon={<GiBookshelf />}
                    />
                    {rule.rules.map((childRule, subIndex) => {
                      // If child has grandchildren, show as nested submenu
                      if (childRule.rules && childRule.rules.length > 0) {
                        return (
                          <SubMenu
                            key={`rule-child-${childRule.slug}-${subIndex}`}
                            label={childRule.name}
                            icon={getRuleIcon(childRule)}
                            style={{ border: 0 }}
                          >
                            <SidebarLink
                              key={`child-overview-${childRule.slug}`}
                              to={`/app/rules/${childRule.slug}`}
                              title={childRule.name}
                              icon={getRuleIcon(childRule)}
                            />
                            {childRule.rules.map((grandchild, gcIndex) => (
                              <SidebarLink
                                key={`rule-grandchild-${grandchild.slug}-${gcIndex}`}
                                to={`/app/rules/${grandchild.slug}`}
                                title={grandchild.name}
                                icon={getRuleIcon(grandchild)}
                              />
                            ))}
                          </SubMenu>
                        );
                      }
                      // Child has no grandchildren, show as direct link
                      return (
                        <SidebarLink
                          key={`rule-child-${childRule.slug}-${subIndex}`}
                          to={`/app/rules/${childRule.slug}`}
                          title={childRule.name}
                          icon={getRuleIcon(childRule)}
                        />
                      );
                    })}
                  </SubMenu>
                );
              }
              // If rule has no children, show as direct link
              return (
                <SidebarLink
                  key={`rule-${rule.slug}-${index}`}
                  to={`/app/rules/${rule.slug}`}
                  title={rule.name}
                  icon={getRuleIcon(rule)}
                />
              );
            })}
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
            <SidebarLink to="/app/items" title="All Equipment" icon={<GiSwapBag />} />
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
