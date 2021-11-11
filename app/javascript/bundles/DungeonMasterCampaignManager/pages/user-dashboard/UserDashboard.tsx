import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Link } from 'react-router-dom';
import { PageProps } from '../../utilities/types';
import { GiBarbute } from 'react-icons/all';
import { useAuth0 } from '@auth0/auth0-react';
import NameField from '../front-page/components/NameField';
import TavernNameField from '../front-page/components/TavernNameField';
import rest from '../../api/api';
import { connect } from 'react-redux';
import MonstersTable from '../monsters/MonstersTable';

const styles = require('./user-dashboard.module.scss');

const UserDashboard = (props: PageProps) => {
  const { user } = props;
  const { isAuthenticated } = useAuth0();
  const pageTitle =
    isAuthenticated && user ? `Welcome, ${user.name}` : 'Welcome';

  return (
    <PageContainer
      pageTitle={pageTitle}
      description={
        "Dungeon Master's Screen is a free resource for DMs for reference that includes tools for smooth games."
      }
    >
      <div className={styles.wrapper}>
        <PageTitle
          title={`The Dungeon Master Screen - ${pageTitle}`}
          isDraconis
        />
        <div className={styles.section}>
          <h2>User Created NPCs</h2>
          <MonstersTable user={user} />
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
    user: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(UserDashboard);
