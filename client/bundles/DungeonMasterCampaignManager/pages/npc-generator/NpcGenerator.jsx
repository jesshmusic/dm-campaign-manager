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

const NpcGenerator = (props) => {
  const [gender, setGender] = useState('female');
  const [race, setRace] = useState('human');

  const handleGenerateCommoner = () => {
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
              <ButtonGroup className={ 'mt-1' } size="lg">
                <Button
                  variant={ 'primary' }
                  onClick={ () => handleGenerateCommoner() }>
                  Get{ gender ? ` ${gender.charAt(0).toUpperCase() + gender.slice(1)}` : '' }{ race ? ` ${race.charAt(0).toUpperCase() + race.slice(1)}` : '' } Commoner
                </Button>
              </ButtonGroup>
              <ButtonGroup className={ 'mt-1' } size="md">
                <Button
                  variant={ 'secondary' }
                  onClick={ () => setGender('male') }>
                  Male
                </Button>
                <Button
                  variant={ 'success' }
                  onClick={ () => setGender('female') }>
                  Female
                </Button>
              </ButtonGroup>
              <ButtonGroup className={ 'mt-1' } size="sm">
                <Button
                  variant={ 'primary' }
                  onClick={ () => setRace('human') }>
                  Human
                </Button>
                <Button
                  variant={ 'secondary' }
                  onClick={ () => setRace('goblin') }>
                  Goblin
                </Button>
                <Button
                  variant={ 'success' }
                  onClick={ () => setRace('orc') }>
                  Orc
                </Button>
                <Button
                  variant={ 'info' }
                  onClick={ () => setRace('ogre') }>
                  Ogre
                </Button>
                <Button
                  variant={ 'primary' }
                  onClick={ () => setRace('dwarf') }>
                  Dwarf
                </Button>
                <Button
                  variant={ 'secondary' }
                  onClick={ () => setRace('elf') }>
                  Elf
                </Button>
                <Button
                  variant={ 'success' }
                  onClick={ () => setRace('halfling') }>
                  Halfling
                </Button>
              </ButtonGroup>
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
