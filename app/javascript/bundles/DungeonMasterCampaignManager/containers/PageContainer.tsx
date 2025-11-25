import React from 'react';

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
import { Transition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';
import ReactGA from 'react-ga4';
import YouTubeAd from '../components/BannerAd/YouTubeAd';
import SearchField from '../components/Search/SearchField';

ReactGA.initialize('G-8XJTH70JSQ');

import styles from './page-container.module.scss';

type PageContainerProps = {
  children?: React.ReactNode;
  description: string;
  pageTitle: string;
};

const PageContainer = (props: PageContainerProps) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const { children, description, pageTitle } = props;
  const [isMobile, setIsMobile] = React.useState(Util.isMobileWidth());

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(Util.isMobileWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  React.useEffect(() => {
    const componentDidMount = () => {
      ReactGA.send({ hitType: 'pageview', page: window.location.pathname });
    };
    componentDidMount();
  }, []);

  const onEnterHandler = (node) => {
    gsap.from(node, {
      duration: 0.4,
      autoAlpha: 0,
      x: -500,
    });
    gsap.to(node, {
      delay: 0.4,
      duration: 0.4,
      scrollTo: 0,
    });
  };

  const onExitHandler = (node) => {
    gsap.to(node, {
      duration: 1,
      autoAlpha: 0,
      scrollTo: 0,
      x: -500,
    });
  };

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
      <TransitionGroup component={null}>
        <Transition
          timeout={500}
          key={window.location.pathname}
          onEnter={onEnterHandler}
          onExit={onExitHandler}
        >
          <div className={styles.pageWrapper}>
            <div className={styles.pageContent}>
              <div
                className={classNames(styles.page, {
                  [styles.collapsed]: isCollapsed,
                })}
              >
                {children}
                <YouTubeAd />
              </div>
            </div>
          </div>
        </Transition>
      </TransitionGroup>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
  };
}

export default connect(mapStateToProps)(PageContainer);
