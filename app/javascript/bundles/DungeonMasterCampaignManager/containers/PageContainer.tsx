import React from 'react';

// Bootstrap
import Footer from '../components/Footer/Footer';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import FlashMessages from '../components/Alerts/FlashMessages';
import '../stylesheets/_fonts.scss';
import '../stylesheets/application.scss';
import { Helmet } from 'react-helmet';
import { FlashMessage } from '../utilities/types';
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
  flashMessages?: FlashMessage[];
  pageTitle: string;
  user?: User;
};

const PageContainer = (props: PageContainerProps) => {
  const { breadcrumbs, children, description, pageTitle, user } = props;

  return (
    <div>
      <Helmet>
        <title>{pageTitle} | Dungeon Master&apos;s Screen</title>
        <meta name="description" content={description} />
      </Helmet>
      <div className={styles.pageWrapper}>
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
    </div>
  );
};

function mapStateToProps(state) {
  return {
    flashMessages: state.flashMessages,
    user: state.users.currentUser,
  };
}

export default connect(mapStateToProps)(PageContainer);
