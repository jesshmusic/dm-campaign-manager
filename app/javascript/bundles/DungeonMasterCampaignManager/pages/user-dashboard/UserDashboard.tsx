import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Link } from 'react-router-dom';
import { PageProps } from '../../utilities/types';
import { GiBarbute } from 'react-icons/all';
import { useAuth0 } from '@auth0/auth0-react';
import NameField from '../front-page/components/NameField';
import TavernNameField from '../front-page/components/TavernNameField';
import { connect } from 'react-redux';
import MonstersTable from '../monsters/MonstersTable';

const styles = require('./user-dashboard.module.scss');

const UserDashboard = (props: PageProps) => {
  const { currentUser } = props;
  const { isAuthenticated, user } = useAuth0();
  const pageTitle = isAuthenticated && user ? `Welcome, ${user.name}` : 'Welcome';

  return (
    <PageContainer
      pageTitle={pageTitle}
      description={
        "Dungeon Master's Screen is an online DM Screen with tools and widgets that make your life easier."
      }
    >
      <div className={styles.wrapper}>
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
        <div className={styles.section}>
          <h2>User Created NPCs</h2>
          {currentUser && <MonstersTable user={currentUser} />}
        </div>
        <div className={styles.section}>
          <Link to="/app/monster-generator" className={styles.buttonBar}>
            <GiBarbute size={24} /> NPC Generators
          </Link>
        </div>
        <div className={styles.section}>
          <NameField />
        </div>
        <div className={styles.section}>
          <TavernNameField />
        </div>
      </div>
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
