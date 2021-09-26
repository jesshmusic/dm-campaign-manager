import React from 'react';

// Container
import PageContainer from '../../containers/PageContainer';
import { fetchData } from '../../actions/api';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import { navigate } from '@reach/router';
import { DndClass, PageProps } from '../../utilities/types';
import { ListGroup } from 'react-bootstrap';
import DndListItem from './components/DndListItem';

const DndClasses = (props: PageProps) => {
  const [dndClasses, setDndClasses] = React.useState([]);

  React.useEffect(() => {
    const componentDidMount = async () => {
      const response = await fetchData({
        method: 'get',
        url: '/v1/dnd_classes.json'
      });
      setDndClasses(response.data?.results);
    };
    componentDidMount();
  }, []);

  const goToPage = (dndClassSlug: string) => {
    navigate(`/app/classes/${dndClassSlug}`);
  };

  return (
    <PageContainer user={props.user}
                   flashMessages={props.flashMessages}
                   pageTitle={'DndClasses'}
                   description={'All D&D classes. Dungeon Master\'s Toolbox is a free resource for DMs to manage their classes, adventures, and Monsters.'}
                   breadcrumbs={[{ isActive: true, title: 'Character Classes' }]}>
      <PageTitle title={'Character Classes'} />
      {dndClasses.length > 0 ? (
        <div className={'table-frame'}>
          <ListGroup variant={'flush'}>
            {dndClasses.map((dndClass: DndClass, index: number) => (
              <DndListItem dndClass={dndClass}
                           key={index}
                           index={index}
                           goToPage={() => goToPage(dndClass.slug)} />
            ))}
          </ListGroup>
        </div>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

export default DndClasses;