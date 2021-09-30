import React from 'react';
import { connect } from 'react-redux';
import rest from '../../actions/api';

// Container
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import { navigate } from '@reach/router';
import { DndClass, PageProps } from '../../utilities/types';
import { ListGroup } from 'react-bootstrap';
import DndListItem from './components/DndListItem';

const DndClasses = (props: PageProps & { getDndClasses: () => void, dndClasses: DndClass[] }) => {
  const { getDndClasses, dndClasses } = props;
  React.useEffect(() => {
    getDndClasses();
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

function mapStateToProps(state) {
  return {
    dndClasses: state.dndClasses.dndClasses,
    user: state.users.user,
    flashMessages: state.flashMessages
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DndClasses);
