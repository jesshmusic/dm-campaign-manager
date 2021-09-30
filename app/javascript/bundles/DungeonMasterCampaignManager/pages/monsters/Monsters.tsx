/**
 * Created by jesshendricks on 2019-08-23
 */

import React from 'react';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import { MonsterSummary, PageProps } from '../../utilities/types';
import { fetchData } from '../../actions/api';
import { navigate } from '@reach/router';
import { ListGroup } from 'react-bootstrap';
import MonsterListItem from './components/MonsterListItem';

const Monsters = (props: PageProps) => {
  const [monsters, setMonsters] = React.useState([]);

  React.useEffect(() => {
    const componentDidMount = async () => {
      const response = await fetchData({
        method: 'get',
        url: '/v1/monsters.json'
      });
      setMonsters(response.data?.results);
    };
    componentDidMount();
  }, []);

  const goToPage = (monsterSlug: string) => {
    navigate(`/app/monsters/${monsterSlug}`);
  };

  return (
    <PageContainer user={props.user}
                   flashMessages={props.flashMessages}
                   pageTitle={'Monsters'}
                   description={'All monsters with descriptions and stats. Dungeon Master\'s Toolbox is a free resource for DMs to manage their campaigns, adventures, and Monsters.'}
                   breadcrumbs={[{ isActive: true, title: 'Monsters' }]}>
      <PageTitle title={'Monsters'} />
      {monsters.length > 0 ? (
        <div className={'table-frame'}>
          <ListGroup variant={'flush'}>
            {monsters.map((monster: MonsterSummary, index: number) => (
              <MonsterListItem monster={monster}
                               key={index}
                               index={index}
                               goToPage={() => goToPage(monster.slug)} />
            ))}
          </ListGroup>
        </div>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

export default Monsters;