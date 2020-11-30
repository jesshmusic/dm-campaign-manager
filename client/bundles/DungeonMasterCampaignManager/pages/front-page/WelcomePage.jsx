import React, {useState} from 'react';
import Col from 'react-bootstrap/Col';
import {Button} from 'react-bootstrap';
import {getHeaders} from '../../actions/api';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import NPCDisplay from '../../components/NPCDisplay';
import GenerateNPC from '../npcs/partials/GenerateNPC';


const WelcomePage = () => {
  const [npc, setNpc] = useState(null);
  const [gender, setGender] = useState('female');
  const [race, setRace] = useState('human');

  const handleGenerateNpc = () => {
    fetch('/v1/generate_npc', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        npc_attributes: {
          name: 'Test',
          size: 'medium',
          alignment: 'Chaotic Evil',
          hit_dice_number: 5,
          monster_type: 'humanoid',
          strength: 16,
          dexterity: 13,
          constitution: 18,
          intelligence: 10,
          wisdom: 12,
          charisma: 10,
        },
      }),
    })
      .then((response) => response.json())
      .then((jsonResult) => {
        console.log(jsonResult);
        setNpc(jsonResult.npc);
      });
  };

  const handleGenerateCommoner = () => {
    const apiURL = `/v1/generate_commoner?random_npc_gender=${gender}&random_npc_race=${race}`;
    fetch(apiURL)
      .then((response) => response.json())
      .then((jsonResult) => {
        console.log(jsonResult);
        setNpc(jsonResult.npc);
      });
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
        {/*<Button*/}
        {/*  variant={ 'primary' }*/}
        {/*  onClick={ () => handleGenerateNpc() }>*/}
        {/*  TEST*/}
        {/*</Button>*/}
      </div>
    </Col>
  );
};

export default WelcomePage;
