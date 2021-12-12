import React from 'react';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { PageProps } from '../../utilities/types';
import { useAuth0 } from '@auth0/auth0-react';
import { connect } from 'react-redux';
import Dashboard from './Dashboard';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';

const styles = require('./user-dashboard.module.scss');

const UserDashboard = (props: PageProps) => {
  const { isAuthenticated, user } = useAuth0();
  const pageTitle = isAuthenticated && user ? `Welcome, ${user.name}` : 'Welcome';

  return (
    <PageContainer
      pageTitle={pageTitle}
      description={
        "Dungeon Master's Screen is an online DM Screen with tools and widgets that make your life easier."
      }
    >
      <PageTitle title={`The Dungeon Master Screen - ${pageTitle}`} isDraconis />
      <div className={styles.section}>
        <h2>Info</h2>
        <div className={styles.userInfo}>
          <div className={styles.userPic}>
            <img src={user!.picture} />
          </div>
          <div className={styles.userData}>
            <p>
              <strong>Name</strong>
              {user!.name}
            </p>
            <p>
              <strong>Username</strong>
              {user!.nickname}
            </p>
            <p>
              <strong>Email</strong>
              {user!.email}
            </p>
          </div>
        </div>
      </div>
      <Dashboard />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
