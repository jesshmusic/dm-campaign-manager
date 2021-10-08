import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle/PageTitle';
import NameField from './components/NameField';
import { Link } from '@reach/router';
import TavernNameField from './components/TavernNameField';
import { PageProps } from '../../utilities/types';
import { GiBarbute } from 'react-icons/all';

const HomePage = (props: PageProps) => (
  <PageContainer
    pageTitle={props.user ? 'Dashboard' : 'Welcome'}
    description={
      "Dungeon Master's Screen is a free resource for DMs for reference that includes tools for smooth games."
    }
    breadcrumbs={[]}
  >
    <div className="container">
      <PageTitle title={'The Dungeon Master Screen'} isDraconis />
      {props.user &&
        (props.user.role === 'admin' ||
          props.user.role === 'dungeon_master') && (
          <div className="d-grid gap-2 mb-3">
            <Link to="/app/monster-generator" className="btn btn-secondary">
              <GiBarbute size={24} /> Generate Monster
            </Link>
          </div>
        )}
      <div className="mb-3">
        <NameField />
      </div>
      <div className="mb-3">
        <TavernNameField />
      </div>
    </div>
  </PageContainer>
);

export default HomePage;
