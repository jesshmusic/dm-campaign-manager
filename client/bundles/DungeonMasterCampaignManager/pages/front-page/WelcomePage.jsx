import React, {useState} from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Button, Form} from 'react-bootstrap';
import {getHeaders} from '../../actions/api';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CopyField from '../../components/CopyField';


const WelcomePage = () => {
  const [copySuccess, setCopySuccess] = useState(false);
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
    <Col sm={ 8 }>
      <p>
        The <strong>Dungeon Master&apos;s Toolbox</strong> is a set of tools and references utilizing the D&D 5e SRD
        data.
      </p>

      {npc ? (
        <div>
          <h3>{npc.name}</h3>
          <Form>
            <Row>
              <CopyField placeHolder={'Name'}
                         fieldId={'npcName'}
                         label={'Name'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         text={npc.name} />
              <CopyField placeHolder={'Size'}
                         fieldId={'npcSize'}
                         label={'Size'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'4'}
                         text={`${npc.size} (${npc.monster_subtype})`} />
              <CopyField placeHolder={'Alignment'}
                         fieldId={'npcAlignment'}
                         label={'Alignment'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'4'}
                         text={npc.alignment} />
              <CopyField placeHolder={'Challenge Rating'}
                         fieldId={'npcChallengeRating'}
                         label={'Challenge Rating'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'4'}
                         text={npc.challenge_rating} />
              <CopyField placeHolder={'Armor Class'}
                         fieldId={'npcArmorClass'}
                         label={'Armor Class'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.armor_class} />
              <CopyField placeHolder={'Hit Points'}
                         fieldId={'npcHitPoints'}
                         label={'Hit Points'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.hit_points} />
              <CopyField placeHolder={'Hit Dice'}
                         fieldId={'npcHitHitDice'}
                         label={'Hit Dice'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'3'}
                         text={`(${npc.hit_dice_number}d${npc.hit_dice_value} ${npc.hit_dice_modifier > 0 ? '+ ' + npc.hit_dice_modifier : ''})`} />
              <CopyField placeHolder={'Speed'}
                         fieldId={'npcSpeed'}
                         label={'Speed'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'5'}
                         text={npc.speed} />
              <CopyField placeHolder={'Strength'}
                         fieldId={'npcStrength'}
                         label={'Strength'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.strength} />
              <CopyField placeHolder={'Dexterity'}
                         fieldId={'npcDexterity'}
                         label={'Dexterity'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.dexterity} />
              <CopyField placeHolder={'Constitution'}
                         fieldId={'npcConstitution'}
                         label={'Constitution'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.constitution} />
              <CopyField placeHolder={'Intelligence'}
                         fieldId={'npcIntelligence'}
                         label={'Intelligence'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.intelligence} />
              <CopyField placeHolder={'Wisdom'}
                         fieldId={'npcWisdom'}
                         label={'Wisdom'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.wisdom} />
              <CopyField placeHolder={'Charisma'}
                         fieldId={'npcCharisma'}
                         label={'Charisma'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.charisma} />
              <CopyField placeHolder={'Senses'}
                         fieldId={'npcSenses'}
                         label={'Senses'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'6'}
                         text={npc.senses} />
              <CopyField placeHolder={'Languages'}
                         fieldId={'npcLanguages'}
                         label={'Languages'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'6'}
                         text={npc.languages} />
            </Row>
          </Form>
        </div>
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
        <Button
          variant={ 'primary' }
          onClick={ () => handleGenerateNpc() }>
          TEST
        </Button>
      </div>
    </Col>
  );
};

export default WelcomePage;
