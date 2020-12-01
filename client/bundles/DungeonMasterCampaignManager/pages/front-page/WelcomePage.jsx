import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Button} from 'react-bootstrap';
import rest from '../../actions/api';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import NPCDisplay from '../../components/NPCDisplay';
import GenerateNPC from '../npcs/partials/GenerateNPC';
import {connect} from 'react-redux';


const WelcomePage = ({npc, generateCommoner}) => {
  const [gender, setGender] = useState('female');
  const [race, setRace] = useState('human');

  const handleGenerateCommoner = () => {
    generateCommoner(gender, race);
  };

  return (
    <Col sm={ 12 }>
      <p>
        The <strong>Dungeon Master&apos;s Toolbox</strong> is a set of tools and references utilizing the D&D 5e SRD
        data.
      </p>

      {npc ? (
        <NPCDisplay npc={npc} />
      ) : null}
      <div>
        <h3>Generate Commoner</h3>
        <ButtonGroup className={ 'mt-1' } size="lg">
          <Button
            variant={ 'primary' }
            onClick={ () => handleGenerateCommoner() }>
            Get{gender ? ` ${gender.charAt(0).toUpperCase() + gender.slice(1)}` : ''}{race ? ` ${race.charAt(0).toUpperCase() + race.slice(1)}` : ''}  Commoner
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
        <GenerateNPC />
      </div>
    </Col>
  );
};

WelcomePage.propTypes = {
  npc: PropTypes.any,
  generateCommoner: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
  return {
    npc: state.npcs.currentNPC,
    flashMessages: state.flashMessages,
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

export default connect(mapStateToProps, mapDispatchToProps)(WelcomePage);
