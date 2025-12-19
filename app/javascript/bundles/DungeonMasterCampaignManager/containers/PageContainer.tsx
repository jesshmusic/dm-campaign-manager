import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Bootstrap
import FlashMessages from '../components/Alerts/FlashMessages';
import '../stylesheets/_fonts.scss';
import '../stylesheets/application.scss';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import Breadcrumbs from '../components/Breadcrumbs/Breadcrumbs';
import SideBar from '../components/SideBar/SideBar';
import { gsap } from 'gsap';
import ReactGA from 'react-ga4';
import SearchField from '../components/Search/SearchField';
import { useSidebar } from '../contexts/SidebarContext';
import { useBreadcrumbs } from '../contexts/BreadcrumbContext';

import { PageWrapper, PageContent, Page, ContentWrapper } from './Containers.styles';

ReactGA.initialize('G-8XJTH70JSQ');

// Wrapper component to connect Breadcrumbs to context
const BreadcrumbsWithContext = () => {
  const { customPaths } = useBreadcrumbs();
  const { isCollapsed } = useSidebar();
  return <Breadcrumbs isCollapsed={isCollapsed} customPaths={customPaths} />;
};

type PageContainerProps = {
  children?: React.ReactNode;
  description: string;
  maxWidth?: boolean;
  pageTitle: string;
};

const PageContainer = (props: PageContainerProps) => {
  const { children, description, maxWidth = false, pageTitle } = props;
  const { sidebarWidth } = useSidebar();
  const nodeRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

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

  return (
    <div id="dmsContainer">
      <FlashMessages />
      <Helmet>
        <title>{pageTitle} | Dungeon Master&apos;s Screen</title>
        <meta name="description" content={description} />
      </Helmet>
      <SideBar />
      <BreadcrumbsWithContext />
      <SearchField />
      <PageWrapper ref={nodeRef}>
        <PageContent>
          <Page $sidebarWidth={sidebarWidth}>
            {maxWidth ? <ContentWrapper>{children}</ContentWrapper> : children}
          </Page>
        </PageContent>
      </PageWrapper>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
  };
}

export default connect(mapStateToProps)(PageContainer);
