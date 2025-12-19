import React, { useCallback, useRef, useState } from 'react';
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
import { getContentUrl, getContentIndexUrl } from '../../utilities/editionUrls';
import {
  SIDEBAR_MIN_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
  SIDEBAR_MAX_WIDTH,
  useSidebar,
} from '../../contexts/SidebarContext';

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
  WelcomeText,
  RoleLabel,
  ResizeHandle,
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
  logOutUser: (token: string) => void;
  rules: RuleType[];
}) => {
  const { currentUser, getRules, logOutUser, rules } = props;

  // Get sidebar state from context
  const { isCollapsed, isMobile, setIsCollapsed, setSidebarWidth, rawSidebarWidth } = useSidebar();
  const sidebarWidth = rawSidebarWidth;

  const { user, getAccessTokenSilently, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const location = useLocation();
  const { edition, isEdition2024 } = useEdition();

  // Resize state
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<{
    startX: number;
    startWidth: number;
    isCurrentlyCollapsed: boolean;
  } | null>(null);

  // Handle resize start
  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsResizing(true);
      resizeRef.current = {
        startX: e.clientX,
        startWidth: isCollapsed ? SIDEBAR_COLLAPSED_WIDTH : sidebarWidth,
        isCurrentlyCollapsed: isCollapsed,
      };

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!resizeRef.current) return;

        const delta = moveEvent.clientX - resizeRef.current.startX;
        const newWidth = resizeRef.current.startWidth + delta;

        // If collapsed and dragging right, expand to min width
        if (resizeRef.current.isCurrentlyCollapsed && newWidth > SIDEBAR_COLLAPSED_WIDTH + 20) {
          setIsCollapsed(false);
          setSidebarWidth(SIDEBAR_MIN_WIDTH);
          // Reset reference point for continued dragging
          resizeRef.current = {
            startX: moveEvent.clientX,
            startWidth: SIDEBAR_MIN_WIDTH,
            isCurrentlyCollapsed: false,
          };
          return;
        }

        // If not collapsed, handle resize with snap behavior
        if (!resizeRef.current.isCurrentlyCollapsed) {
          // Snap to collapsed if dragged below threshold
          if (newWidth < SIDEBAR_MIN_WIDTH - 40) {
            setIsCollapsed(true);
            // Reset reference point for continued dragging
            resizeRef.current = {
              startX: moveEvent.clientX,
              startWidth: SIDEBAR_COLLAPSED_WIDTH,
              isCurrentlyCollapsed: true,
            };
            return;
          }

          // Clamp width between min and max
          const clampedWidth = Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, newWidth));
          setSidebarWidth(clampedWidth);
        }
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        resizeRef.current = null;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ew-resize';
      document.body.style.userSelect = 'none';
    },
    [isCollapsed, sidebarWidth, setIsCollapsed, setSidebarWidth],
  );

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

  // Calculate display width
  const displayWidth = isCollapsed ? `${SIDEBAR_COLLAPSED_WIDTH}px` : `${sidebarWidth}px`;

  return (
    <SidebarWrapper>
      <Sidebar
        collapsed={isCollapsed}
        image={sidebarBG}
        backgroundColor="rgba(87, 26, 16, 0.3)"
        width={displayWidth}
        collapsedWidth={`${SIDEBAR_COLLAPSED_WIDTH}px`}
        rootStyles={{
          borderRight: '0.25rem solid #c9ad6a',
          height: '100vh',
          position: 'fixed',
          top: 0,
          transition: isResizing ? 'none' : 'width 0.15s ease-out',
        }}
      >
        {!isMobile && <ResizeHandle $isResizing={isResizing} onMouseDown={handleResizeStart} />}
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
          <SidebarLink
            to={getContentIndexUrl('classes', edition)}
            title="Classes"
            icon={<GiPerson />}
          />
          <SidebarLink
            to={getContentIndexUrl('races', edition)}
            title={racesLabel}
            icon={<GiDwarfFace />}
          />
          {isEdition2024 && (
            <>
              <SidebarLink
                to={getContentIndexUrl('backgrounds', edition)}
                title="Backgrounds"
                icon={<GiSecretBook />}
              />
              <SidebarLink
                to={getContentIndexUrl('feats', edition)}
                title="Feats"
                icon={<GiUpgrade />}
              />
            </>
          )}
          <SidebarLink
            to={getContentIndexUrl('monsters', edition)}
            title="Monsters"
            icon={<GiMonsterGrasp />}
          />
          <SidebarLink
            to={getContentIndexUrl('spells', edition)}
            title="Spells"
            icon={<GiMagicPalm />}
          />
          <SubMenu
            label="Rules"
            icon={<GiBookshelf />}
            open={rulesOpen}
            onOpenChange={setRulesOpen}
            style={{
              borderBottom: '0.125rem solid #c9ad6a',
            }}
          >
            <SidebarLink
              to={getContentIndexUrl('rules', edition)}
              title="All Rules"
              icon={<GiBookshelf />}
            />
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
                      to={getContentUrl('rules', rule.slug, edition)}
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
                              to={getContentUrl('rules', childRule.slug, edition)}
                              title={childRule.name}
                              icon={getRuleIcon(childRule)}
                            />
                            {childRule.rules.map((grandchild, gcIndex) => (
                              <SidebarLink
                                key={`rule-grandchild-${grandchild.slug}-${gcIndex}`}
                                to={getContentUrl('rules', grandchild.slug, edition)}
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
                          to={getContentUrl('rules', childRule.slug, edition)}
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
                  to={getContentUrl('rules', rule.slug, edition)}
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
            <SidebarLink
              to={getContentIndexUrl('items', edition)}
              title="All Equipment"
              icon={<GiSwapBag />}
            />
            {itemTypes.map((itemType, index) => (
              <SidebarLink
                key={`items-${index}`}
                to={getContentUrl('items', itemType.link.replace('/app/items/', ''), edition)}
                title={itemType.name}
                icon={itemType.icon}
              />
            ))}
          </SubMenu>
        </Menu>

        <StyledFooter>
          <UserWelcome $isCollapsed={isCollapsed}>
            <WelcomeText $isCollapsed={isCollapsed}>
              {isAuthenticated && user ? `Welcome, ${user.given_name}` : 'User'}
            </WelcomeText>
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
