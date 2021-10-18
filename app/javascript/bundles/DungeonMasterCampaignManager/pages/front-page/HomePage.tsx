import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import NameField from './components/NameField';
import { Link } from '@reach/router';
import TavernNameField from './components/TavernNameField';
import { PageProps } from '../../utilities/types';
import { GiBarbute } from 'react-icons/all';
import { useAuth0 } from '@auth0/auth0-react';

const styles = require('./home-page.module.scss');

const HomePage = (props: PageProps) => {
  const { isAuthenticated, user } = useAuth0();
  console.log(user);
  return (
    <PageContainer
      pageTitle={isAuthenticated && user ? `Welcome, ${user.given_name}` : 'Welcome'}
      description={
        'Dungeon Master\'s Screen is a free resource for DMs for reference that includes tools for smooth games.'
      }
      breadcrumbs={[]}
    >
      <div className={styles.wrapper}>
        <PageTitle title={'The Dungeon Master Screen'} isDraconis />
        {isAuthenticated && user && (
          <div className={styles.section}>
            <Link to='/app/monster-generator' className={styles.buttonBar}>
              <GiBarbute size={24} /> NPC Generators
            </Link>
          </div>
        )}
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

export default HomePage;
