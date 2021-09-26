import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import NameField from '../../components/NameField';
import { Link } from '@reach/router';
import TavernNameField from '../../components/TavernNameField';
import { PageProps } from '../../utilities/types';
import { GiBarbute } from 'react-icons/all';

const HomePage = (props: PageProps) => (
  <PageContainer user={props.user}
                 flashMessages={props.flashMessages}
                 pageTitle={props.user ? 'Dashboard' : 'Welcome'}
                 description={'Dungeon Master\'s Screen is a free resource for DMs for reference that includes tools for smooth games.'}
                 breadcrumbs={[]}>
    <div className='container'>
      <PageTitle title={'DM Screen'} className={'home'} />
      <div className='d-grid gap-2 mb-3'>
        <Link to='/app/npc-generator' className='btn btn-secondary'><GiBarbute size={24} /> Generate NPC</Link>
      </div>
      <div className='mb-3'>
        <NameField colWidth='12' />
      </div>
      <div className='mb-3'>
        <TavernNameField colWidth='12' />
      </div>
    </div>
  </PageContainer>
);

export default HomePage;
