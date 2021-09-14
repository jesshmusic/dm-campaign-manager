import React from 'react';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import { fetchData } from '../../actions/api';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import { navigate } from '@reach/router';
import { RouteComponentProps } from '@reach/router';
import { DndClass, DndClasses, IFlashMessage, IUser } from '../../utilities/types';
import { ListGroup } from 'react-bootstrap';
import DndListItem from './components/DndListItem';


type DndClassesPageProps = {
  dndClasses?: DndClasses;
  dndClassSlug: string,
  flashMessages: [IFlashMessage];
  getDndClasses: () => void;
  user: IUser,
}

const DndClasses: React.FC<RouteComponentProps> = (props: DndClassesPageProps) => {
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
                   description={'All D&D dndClasses. Dungeon Master\'s Toolbox is a free resource for DMs to manage their dndClasses, adventures, and NPCs.'}
                   breadcrumbs={[{ url: null, isActive: true, title: 'Character Classes' }]}>
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