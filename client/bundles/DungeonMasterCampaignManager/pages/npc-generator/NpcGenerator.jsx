import React, {useState} from 'react';
import PropTypes from 'prop-types';

// Container
import {connect} from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import NPCDisplay from '../../components/NPCDisplay';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {Button} from 'react-bootstrap';
import GenerateNPC from '../npcs/partials/GenerateNPC';
import Col from 'react-bootstrap/Col';
import rest from '../../actions/api';
import NameOptions from '../../components/forms/NameOptions';

const NpcGenerator = (props) => {
  const handleGenerateCommoner = (gender, race) => {
    props.generateCommoner(gender, race);
  };

  return (
    <PageContainer user={ props.user }
                   flashMessages={ props.flashMessages }
                   pageTitle={ 'NPC Generator' }
                   description={ 'Several generators to build quick NPCs. Fields can be copied and pasted into Fantasy Grounds.' }
                   breadcrumbs={ [{url: null, isActive: true, title: 'NPC Generator'}] }>
      <Container>
        <PageTitle title={ 'NPC Generator' }/>
        <Row>
          <Col sm={ 12 }>
            <p>
              Several generators to build quick NPCs. Fields can be copied and pasted into Fantasy Grounds.
            </p>

            { props.npc ? (
              <NPCDisplay npc={ props.npc } shortDisplay/>
            ) : null }
            <div>
              <h3>Generate Commoner</h3>
              <NameOptions onFormSubmit={handleGenerateCommoner} submitText={'Commoner'}/>
            </div>
            <div>
              <h3>Random NPC Generator</h3>
              <GenerateNPC/>
            </div>
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
