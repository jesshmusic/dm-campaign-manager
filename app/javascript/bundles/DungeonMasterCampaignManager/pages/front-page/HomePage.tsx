import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import { PageProps } from '../../utilities/types';
import { useAuth0 } from '@auth0/auth0-react';
import Dashboard from '../user-dashboard/Dashboard';

import { Wrapper } from './HomePage.styles';

const HomePage = (_props: PageProps) => {
  const { isAuthenticated, user } = useAuth0();

  return (
    <PageContainer
      pageTitle={isAuthenticated && user ? `Welcome, ${user.given_name}` : 'Welcome'}
      description={
        'Dungeon Master GURU is a free resource for DMs for reference that includes tools for smooth games.'
      }
    >
      <Wrapper>
        <PageTitle title={'Dungeon Master GURU'} isDraconis />
        <Dashboard />
      </Wrapper>
    </PageContainer>
  );
};

export default HomePage;
