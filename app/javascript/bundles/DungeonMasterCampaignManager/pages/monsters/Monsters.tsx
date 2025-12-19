import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import MonstersTable from './MonstersTable';
import { useEdition } from '../../contexts/EditionContext';

const Monsters = (_props: object) => {
  const { isEdition2014 } = useEdition();

  return (
    <PageContainer
      description="All monsters with descriptions and stats. Dungeon Master's Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters."
      maxWidth
      pageTitle="Monsters"
    >
      <PageTitle title={'Monsters'} isLegacy={isEdition2014} />
      <MonstersTable />
    </PageContainer>
  );
};

export default Monsters;
