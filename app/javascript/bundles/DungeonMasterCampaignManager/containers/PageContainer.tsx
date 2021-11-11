import React from 'react';

// Bootstrap
import FlashMessages from '../components/Alerts/FlashMessages';
import '../stylesheets/_fonts.scss';
import '../stylesheets/application.scss';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import Breadcrumbs, {
  BreadCrumbProps,
} from '../components/Breadcrumbs/Breadcrumbs';
import SideBar from '../components/SideBar/SideBar';
import Util from '../utilities/utilities';

const styles = require('./page-container.module.scss');

type PageContainerProps = {
  children?: React.ReactNode;
  description: string;
  pageTitle: string;
};

const PageContainer = (props: PageContainerProps) => {
  const { children, description, pageTitle } = props;
  const [isMobile, setIsMobile] = React.useState(Util.isMobileWidth());

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(Util.isMobileWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <FlashMessages />
      <Helmet>
        <title>{pageTitle} | Dungeon Master&apos;s Screen</title>
        <meta name="description" content={description} />
      </Helmet>
      <SideBar isCollapsed={isMobile} />
      <Breadcrumbs />
      <div className={styles.pageWrapper}>
        <div className={styles.pageContent}>
          <div className={styles.page}>{children}</div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
  };
}

export default connect(mapStateToProps)(PageContainer);
