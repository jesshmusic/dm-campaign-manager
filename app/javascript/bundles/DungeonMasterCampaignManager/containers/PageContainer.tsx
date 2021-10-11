import React from 'react';

// Bootstrap
import Footer from '../components/Footer/Footer';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import FlashMessages from '../components/Alerts/FlashMessages';
import '../stylesheets/_fonts.scss';
import '../stylesheets/application.scss';
import { Helmet } from 'react-helmet';
import { FlashMessage, UserProps } from '../utilities/types';
import SignInModal from '../components/SignInModal';
import rest from '../actions/api';
import { connect } from 'react-redux';
import Breadcrumbs, {
  BreadCrumbProps,
} from '../components/Breadcrumbs/Breadcrumbs';
import SideBar from '../components/SideBar/SideBar';
import Util from '../utilities/utilities';

const styles = require('./page-container.module.scss');

type PageContainerProps = {
  breadcrumbs: BreadCrumbProps[];
  children?: React.ReactNode;
  description: string;
  flashMessages?: FlashMessage[];
  pageTitle: string;
  user?: UserProps;
  userLogin: (username: string, password: string) => void;
};

const PageContainer = (props: PageContainerProps) => {
  const { breadcrumbs, children, description, pageTitle, user, userLogin } =
    props;
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
      <Helmet>
        <title>{pageTitle} | Dungeon Master&apos;s Screen</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className={styles.pageWrapper}>
        {/*<MenuBar />*/}
        <SideBar isCollapsed={isMobile} />
        <div className={styles.pageContent}>
          <HeroBanner />
          <div className={styles.page}>
            <FlashMessages messages={props.flashMessages || []} />
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <Breadcrumbs breadcrumbs={breadcrumbs} />
            ) : null}
            {children}
          </div>
          <Footer user={user} />
        </div>
      </div>
      <SignInModal user={user} userLogin={userLogin} />
    </div>
  );
};

function mapStateToProps(state) {
  return {
    flashMessages: state.flashMessages,
    user: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogin: (email: string, password: string) => {
      dispatch(
        rest.actions.userLogin({
          user: { email, password },
        })
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PageContainer);
