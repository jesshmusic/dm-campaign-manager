import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import MonstersTable from './MonstersTable';

const Monsters = (props: {}) => {
  return (
    <PageContainer
      pageTitle="Monsters"
      description={
        "All monsters with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
      }
    >
      <PageTitle title={'Monsters'} />
      <MonstersTable />
    </PageContainer>
  );
};

export default Monsters;
