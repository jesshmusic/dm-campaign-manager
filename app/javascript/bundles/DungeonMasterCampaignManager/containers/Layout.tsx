import React, { useCallback, useMemo } from 'react';
import { connect } from 'react-redux';
import { useAuth0, User } from '@auth0/auth0-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FlashMessage } from '../utilities/types';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import Footer from '../components/Footer/Footer';
import YouTubeAd from '../components/BannerAd/YouTubeAd';
import rest from '../api/api';
import DMRoutes from '../navigation/DMRoutes';
import Util from '../utilities/utilities';
import {
  SidebarProvider,
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
} from '../contexts/SidebarContext';

import { AppContainer } from './Containers.styles';

gsap.registerPlugin(ScrollToPlugin);

// Get saved sidebar state from localStorage
const getSavedSidebarState = (): { collapsed: boolean; width: number } => {
  if (typeof window !== 'undefined') {
    const collapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    const savedWidth = localStorage.getItem('sidebar-width');
    const width = savedWidth ? parseInt(savedWidth, 10) : SIDEBAR_DEFAULT_WIDTH;
    return { collapsed, width };
  }
  return { collapsed: false, width: SIDEBAR_DEFAULT_WIDTH };
};

const Layout = (props) => {
  const [flashMessages, setFlashMessages] = React.useState<FlashMessage[]>([]);
  const parentNode = React.useRef(null);

  // Sidebar state - lifted up from PageContainer
  const savedState = getSavedSidebarState();
  const [isCollapsed, setIsCollapsedState] = React.useState(savedState.collapsed);
  const [sidebarWidth, setSidebarWidthState] = React.useState(savedState.width);
  const [isMobile, setIsMobile] = React.useState(Util.isMobileWidth());

  const setIsCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsedState(collapsed);
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, []);

  const setSidebarWidth = useCallback((width: number) => {
    setSidebarWidthState(width);
    localStorage.setItem('sidebar-width', String(width));
  }, []);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(Util.isMobileWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const effectiveCollapsed = isCollapsed || isMobile;
  const effectiveWidth = effectiveCollapsed ? SIDEBAR_COLLAPSED_WIDTH : sidebarWidth;

  const sidebarContextValue = useMemo(
    () => ({
      isCollapsed: effectiveCollapsed,
      sidebarWidth: effectiveWidth,
      isMobile,
      setIsCollapsed,
      setSidebarWidth,
      rawSidebarWidth: sidebarWidth,
    }),
    [effectiveCollapsed, effectiveWidth, isMobile, setIsCollapsed, setSidebarWidth, sidebarWidth],
  );

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  React.useEffect(() => {
    if (isAuthenticated && user && !props.currentUser) {
      getAccessTokenSilently()
        .then((token) => {
          props.logInUser(user, token);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [isAuthenticated, user, props.currentUser]);

  const addFlashMessage = (flashMessage: FlashMessage) => {
    setFlashMessages([...flashMessages, flashMessage]);
  };

  const combinedProps = {
    ...props,
    flashMessages,
    addFlashMessage,
  };

  return (
    <SidebarProvider value={sidebarContextValue}>
      <AppContainer ref={parentNode}>
        <HeroBanner />
        <DMRoutes {...combinedProps} />
        <YouTubeAd />
        <Footer user={combinedProps.user} />
      </AppContainer>
    </SidebarProvider>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.users.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logInUser: (user: User, token: string) => {
      const currentUser = {
        auth_id: user.sub,
        email: user.email,
        name: user.name,
        roles: user['https://dm-campaign-manager.appRoles'],
        username: user.nickname,
      };
      dispatch(
        rest.actions.login(
          {},
          {
            body: JSON.stringify({ user: currentUser }),
            token,
          },
        ),
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
