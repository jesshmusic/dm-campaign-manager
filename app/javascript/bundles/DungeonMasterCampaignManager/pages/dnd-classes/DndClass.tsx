import React from 'react';
import {connect} from 'react-redux';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import {IDndClass, IFlashMessage, IUser} from "../../utilities/types";
import {RouteComponentProps} from "@reach/router";

interface IDndClassPage {
  dndClass?: IDndClass;
  dndClassSlug: string,
  flashMessages: [IFlashMessage];
  getDndClass: (dndClassSlug: string) => void;
  user: IUser,
}

const DndClass: React.FC<RouteComponentProps> = (props: IDndClassPage) => {
  React.useEffect(() => {
    props.getDndClass(props.dndClassSlug);
  }, []);
  const {user, flashMessages, dndClass} = props;
  const dndClassTitle = dndClass ? dndClass.name : 'Class Loading...';
  return (
    <PageContainer user={user}
                   flashMessages={flashMessages}
                   pageTitle={dndClassTitle}
                   description={`DndClass: ${dndClassTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and NPCs.`}
                   breadcrumbs={[{url: '/app/classes', isActive: false, title: 'Character Classes'},
                     {url: null, isActive: true, title: dndClassTitle}]}>
      <PageTitle title={'Character Classes'}/>
      {dndClass ? (
        <Row>
          <Col>
            <h2>Proficiencies</h2>
            <ListGroup>
              {dndClass.proficiencies.map((prof, index) => (
                <ListGroupItem key={index}>
                  <strong>{prof.name}</strong> - type: {prof.profType}
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
          <Col>
            <h2>Proficiency Choices</h2>
            <ListGroup>
              {dndClass.proficiencyChoices.map((profChoice, index) => (
                <ListGroupItem key={index}>
                  <strong>Choose {profChoice.numChoices} from </strong>
                  <ListGroup>
                    {profChoice.proficiencies.map((prof, index) => (
                      <ListGroupItem key={index}>
                        <strong>{prof.name}</strong> - type: {prof.profType}
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </ListGroupItem>
              ))}
            </ListGroup>
          </Col>
        </Row>
      ) : (
        <DndSpinner/>
      )}
    </PageContainer>
  );
}

function mapStateToProps(state) {
  return {
    dndClass: state.dndClasses.currentDndClass,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDndClass: (dndClassSlug: string) => {
      dispatch(rest.actions.getDndClass({slug: dndClassSlug}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DndClass);