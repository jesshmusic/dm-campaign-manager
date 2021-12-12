import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { PageProps } from '../../utilities/types';
import { useAuth0 } from '@auth0/auth0-react';
import Dashboard from '../user-dashboard/Dashboard';

const styles = require('./home-page.module.scss');

const HomePage = (props: PageProps) => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <PageContainer
      pageTitle={isAuthenticated && user ? `Welcome, ${user.given_name}` : 'Welcome'}
      description={
        "Dungeon Master's Screen is a free resource for DMs for reference that includes tools for smooth games."
      }
    >
      <div className={styles.wrapper}>
        <PageTitle title={'The Dungeon Master Screen'} isDraconis />
        <Dashboard />
      </div>
    </PageContainer>
  );
};

export default HomePage;
