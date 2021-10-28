import React from 'react';

// Bootstrap
import Footer from '../components/Footer/Footer';
import FlashMessages from '../components/Alerts/FlashMessages';
import '../stylesheets/_fonts.scss';
import '../stylesheets/application.scss';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import Breadcrumbs, {
  BreadCrumbProps,
} from '../components/Breadcrumbs/Breadcrumbs';
import { User } from '@auth0/auth0-react';

const styles = require('./page-container.module.scss');

type PageContainerProps = {
  breadcrumbs: BreadCrumbProps[];
  children?: React.ReactNode;
  description: string;
  pageTitle: string;
  user?: User;
};

const PageContainer = (props: PageContainerProps) => {
  const { breadcrumbs, children, description, pageTitle, user } = props;

  return (
    <div>
      <FlashMessages />
      <Helmet>
        <title>{pageTitle} | Dungeon Master&apos;s Screen</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className={styles.pageWrapper}>
        <div className={styles.pageContent}>
          <div className={styles.page}>
            {/*{breadcrumbs && breadcrumbs.length > 0 ? (*/}
            {/*  <Breadcrumbs breadcrumbs={breadcrumbs} />*/}
            {/*) : null}*/}
            {children}
          </div>
          <Footer user={user} />
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
