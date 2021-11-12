import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { Link } from 'react-router-dom';
import { PageProps, UserProps } from '../../utilities/types';
import { GiBarbute } from 'react-icons/all';
import { useAuth0 } from '@auth0/auth0-react';
import NameField from '../front-page/components/NameField';
import TavernNameField from '../front-page/components/TavernNameField';
import rest from '../../api/api';
import { connect } from 'react-redux';
import MonstersTable from '../monsters/MonstersTable';

const styles = require('./admin-dashboard.module.scss');

const AdminDashboard = (props: {
  getUsers: () => void;
  user: UserProps;
  users: UserProps[];
}) => {
  const { getUsers, user, users } = props;

  React.useEffect(() => {
    getUsers();
  }, []);

  return (
    <PageContainer
      pageTitle={'DM Screen Admin'}
      description={
        "Dungeon Master's Screen is a free resource for DMs for reference that includes tools for smooth games."
      }
    >
      <div className={styles.wrapper}>
        <PageTitle title="DM Screen Admin" />
        <div className={styles.section}>
          <h2>User Created NPCs</h2>
          <MonstersTable user={user} />
        </div>
      </div>
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.currentUser,
    users: state.users.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUsers: () => {
      dispatch(rest.actions.getUsers());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdminDashboard);
