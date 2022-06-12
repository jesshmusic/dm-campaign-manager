import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { UserProps } from '../../utilities/types';
import { connect } from 'react-redux';
import MonstersTable from '../monsters/MonstersTable';
import UsersTable from './components/UsersTable';
import { GiBarbute } from 'react-icons/all';
import { Link } from 'react-router-dom';
import ActionsTable from './components/ActionsTable';
import WidgetsTable from './components/WidgetsTable';

const styles = require('./admin-dashboard.module.scss');

const AdminDashboard = (props: { user: UserProps }) => {
  const { user } = props;

  return (
    <PageContainer
      pageTitle={'DM Screen Admin'}
      description={
        "Dungeon Master's Screen is a free resource for DMs for reference that includes tools for smooth games."
      }
    >
      <PageTitle title="DM Screen Admin" />
      <div className={styles.wrapper}>
        <div className={styles.leftColumn}>
          <div className={styles.section}>
            <h2>Users</h2>
            <UsersTable />
          </div>
          <div className={styles.section}>
            <h2>User Created NPCs</h2>
            {user ? <MonstersTable user={user} /> : null}
          </div>
          <div className={styles.section}>
            <h2>Custom Widgets</h2>
            <WidgetsTable />
          </div>
          <div className={styles.section}>
            <h2>Custom Actions</h2>
            <ActionsTable />
          </div>
        </div>
        <div className={styles.rightColumn}>
          <Link to="/app/monster-generator" className={styles.buttonBar}>
            <GiBarbute size={24} /> NPC Generators
          </Link>
          <Link to="/app/admin-dashboard/create-custom-action" className={styles.buttonBarGreen}>
            <GiBarbute size={24} /> Create Custom Action
          </Link>
          <Link to="/app/admin-dashboard/create-widget" className={styles.buttonBar}>
            <GiBarbute size={24} /> Create Widget
          </Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
