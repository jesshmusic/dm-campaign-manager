import React, {useState} from 'react';
import PropTypes from 'prop-types';

// Container
import {connect} from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import NPCDisplay from '../npcs/partials/NPCDisplay';
import GenerateNPC from '../npcs/partials/GenerateNPC';
import Col from 'react-bootstrap/Col';
import rest from '../../actions/api';
import Convert2eNPC from '../npcs/partials/Convert2eNPC';
import Accordion from 'react-bootstrap/Accordion';
import GenerateCommoner from '../npcs/partials/GenerateCommoner';

const NpcGenerator = (props) => {
  const handleGenerateCommoner = (gender, race) => {
    props.generateCommoner(gender, race);
  };

  return (
    <PageContainer user={ props.user }
                   flashMessages={ props.flashMessages }
                   pageTitle={ 'NPC Generators and Converters' }
                   description={ 'Several generators to build quick Monsters. Fields can be copied and pasted into Fantasy Grounds.' }
                   breadcrumbs={ [{url: null, isActive: true, title: 'NPC Generator'}] }>
      <Container>
        <PageTitle title={ 'NPC Generators and Converters' }/>
        <Row>
          <Col sm={ 12 }>
            <p>
              Several generators to build quick NPCs. Fields can be copied and pasted into Fantasy Grounds.
            </p>

            { props.npc ? (
              <NPCDisplay npc={ props.npc } shortDisplay/>
            ) : null }
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item eventKey={ '0' }>
                <Accordion.Header>Commoner</Accordion.Header>
                <Accordion.Body>
                  <GenerateCommoner onFormSubmit={ handleGenerateCommoner }/>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={ '1' }>
                <Accordion.Header>Generate NPC</Accordion.Header>
                <Accordion.Body>
                  <GenerateNPC/>
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey={ '2' }>
                <Accordion.Header>Convert 2nd Edition</Accordion.Header>
                <Accordion.Body>
                  <Convert2eNPC/>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Col>
        </Row>
      </Container>
    </PageContainer>
  );
};

NpcGenerator.propTypes = {
  flashMessages: PropTypes.array,
  generateCommoner: PropTypes.func.isRequired,
  npcsCount: PropTypes.number.isRequired,
  npc: PropTypes.any,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    flashMessages: state.flashMessages,
    npcsCount: state.npcs.count,
    npc: state.npcs.currentNPC,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    generateCommoner: (gender, race) => {
      dispatch(rest.actions.generateCommoner({gender, race}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NpcGenerator);
