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
import Util from '../utilities/utilities';
import { gsap } from 'gsap';
import ReactGA from 'react-ga4';
import YouTubeAd from '../components/BannerAd/YouTubeAd';
import SearchField from '../components/Search/SearchField';

import { PageWrapper, PageContent, Page } from './Containers.styles';

ReactGA.initialize('G-8XJTH70JSQ');

type PageContainerProps = {
  children?: React.ReactNode;
  description: string;
  pageTitle: string;
};

const PageContainer = (props: PageContainerProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { children, description, pageTitle } = props;
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

  return (
    <div id="dmsContainer">
      <FlashMessages />
      <Helmet>
        <title>{pageTitle} | Dungeon Master&apos;s Screen</title>
        <meta name="description" content={description} />
      </Helmet>
      <SideBar
        isCollapsed={isCollapsed || isMobile}
        setIsCollapsed={setIsCollapsed}
        isMobile={isMobile}
      />
      <Breadcrumbs isCollapsed={isCollapsed} />
      <SearchField />
      <PageWrapper ref={nodeRef}>
        <PageContent>
          <Page $isCollapsed={isCollapsed}>
            {children}
            <YouTubeAd />
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
