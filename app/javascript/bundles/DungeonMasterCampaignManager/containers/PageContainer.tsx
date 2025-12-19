import React, { useRef, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';

// Bootstrap
import FlashMessages from '../components/Alerts/FlashMessages';
import '../stylesheets/_fonts.scss';
import '../stylesheets/application.scss';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import SideBar from '../components/SideBar/SideBar';
import Util from '../utilities/utilities';
import { gsap } from 'gsap';
import ReactGA from 'react-ga4';
import SearchField from '../components/Search/SearchField';
import {
  SidebarProvider,
  SIDEBAR_DEFAULT_WIDTH,
  SIDEBAR_COLLAPSED_WIDTH,
} from '../contexts/SidebarContext';
import { useBreadcrumbs } from '../contexts/BreadcrumbContext';

import { PageWrapper, PageContent, Page, ContentWrapper } from './Containers.styles';

ReactGA.initialize('G-8XJTH70JSQ');

// Wrapper component to connect Breadcrumbs to context
const BreadcrumbsWithContext = ({ isCollapsed }: { isCollapsed: boolean }) => {
  const { customPaths } = useBreadcrumbs();
  return <Breadcrumbs isCollapsed={isCollapsed} customPaths={customPaths} />;
};

type PageContainerProps = {
  children?: React.ReactNode;
  description: string;
  maxWidth?: boolean;
  pageTitle: string;
};

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

const PageContainer = (props: PageContainerProps) => {
  const savedState = getSavedSidebarState();
  const [isCollapsed, setIsCollapsedState] = React.useState(savedState.collapsed);
  const [sidebarWidth, setSidebarWidthState] = React.useState(savedState.width);
  const { children, description, maxWidth = false, pageTitle } = props;

  // Wrap setIsCollapsed to persist to localStorage
  const setIsCollapsed = useCallback((collapsed: boolean) => {
    setIsCollapsedState(collapsed);
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }, []);

  // Wrap setSidebarWidth to persist to localStorage
  const setSidebarWidth = useCallback((width: number) => {
    setSidebarWidthState(width);
    localStorage.setItem('sidebar-width', String(width));
  }, []);
  const [isMobile, setIsMobile] = React.useState(Util.isMobileWidth());
  const nodeRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(Util.isMobileWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    ReactGA.send({ hitType: 'pageview', page: location.pathname });
  }, [location.pathname]);

  // Animate content on mount and when location changes
  React.useEffect(() => {
    if (!nodeRef.current) return;
    gsap.killTweensOf(nodeRef.current);
    gsap.set(nodeRef.current, { autoAlpha: 1, x: 0 });
    gsap.from(nodeRef.current, {
      duration: 0.3,
      autoAlpha: 0,
      x: -100,
    });
  }, [location.pathname]);

  const effectiveCollapsed = isCollapsed || isMobile;
  const effectiveWidth = effectiveCollapsed ? SIDEBAR_COLLAPSED_WIDTH : sidebarWidth;

  const sidebarContextValue = useMemo(
    () => ({
      isCollapsed: effectiveCollapsed,
      sidebarWidth: effectiveWidth,
    }),
    [effectiveCollapsed, effectiveWidth],
  );

  return (
    <SidebarProvider value={sidebarContextValue}>
      <div id="dmsContainer">
        <FlashMessages />
        <Helmet>
          <title>{pageTitle} | Dungeon Master&apos;s Screen</title>
          <meta name="description" content={description} />
        </Helmet>
        <SideBar
          isCollapsed={effectiveCollapsed}
          setIsCollapsed={setIsCollapsed}
          isMobile={isMobile}
          sidebarWidth={sidebarWidth}
          setSidebarWidth={setSidebarWidth}
        />
        <BreadcrumbsWithContext isCollapsed={isCollapsed} />
        <SearchField />
        <PageWrapper ref={nodeRef}>
          <PageContent>
            <Page $sidebarWidth={effectiveWidth}>
              {maxWidth ? <ContentWrapper>{children}</ContentWrapper> : children}
            </Page>
          </PageContent>
        </PageWrapper>
      </div>
    </SidebarProvider>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
  };
}

export default connect(mapStateToProps)(PageContainer);
