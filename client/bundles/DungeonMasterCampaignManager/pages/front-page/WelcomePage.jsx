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
    <Col sm={ 12 }>
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
                         text={npc.size_and_type} />
              <CopyField placeHolder={'Alignment'}
                         fieldId={'npcAlignment'}
                         label={'Alignment'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'4'}
                         text={npc.alignment} />
              <CopyField placeHolder={'CR'}
                         fieldId={'npcChallengeRating'}
                         label={'CR'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.challenge_rating} />
              <CopyField placeHolder={'XP'}
                         fieldId={'npcXP'}
                         label={'XP'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'2'}
                         text={npc.xp} />
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
                         text={npc.hit_dice} />
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
              <CopyField placeHolder={'None'}
                         fieldId={'npcSavingThrows'}
                         label={'Saving Throws'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         text={npc.saving_throws} />
              <CopyField placeHolder={'None'}
                         fieldId={'npcSkills'}
                         label={'Skills'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         text={npc.skills_string} />
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
              <CopyField placeHolder={'None'}
                         fieldId={'npcImmunities'}
                         label={'Immunities'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'12'}
                         text={npc.damage_immunities} />
              <CopyField placeHolder={'None'}
                         fieldId={'npcResistances'}
                         label={'Resistances'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'12'}
                         text={npc.damage_resistances} />
              <CopyField placeHolder={'None'}
                         fieldId={'npcVulnerabilites'}
                         label={'Vulnerabilites'}
                         copySuccess={copySuccess}
                         setCopySuccess={setCopySuccess}
                         colWidth={'12'}
                         text={npc.damage_vulnerabilities} />
              <Col md={'12'}>
                <h4>Actions</h4>
              </Col>
              {npc.monster_actions.map((action) => (
                <CopyField placeHolder={action.name}
                           key={action.id}
                           fieldId={`npcAction${action.id}`}
                           label={action.name}
                           copySuccess={copySuccess}
                           setCopySuccess={setCopySuccess}
                           colWidth={'12'}
                           text={action.description} />
              )) }
              {npc.monster_legendary_actions.length > 0 ? (
                <Col md={'12'}>
                  <Row>
                    <Col md={'12'}>
                      <h4>Legendary Actions</h4>
                    </Col>
                    {npc.monster_legendary_actions.map((action) => (
                      <CopyField placeHolder={action.name}
                                 key={action.id}
                                 fieldId={`npcLegendaryAction${action.id}`}
                                 label={action.name}
                                 copySuccess={copySuccess}
                                 setCopySuccess={setCopySuccess}
                                 colWidth={'12'}
                                 isTextArea
                                 text={action.description} />
                    )) }
                  </Row>
                </Col>
              ) : null}
              {npc.monster_special_abilities.length > 0 ? (
                <Col md={'12'}>
                  <Row>
                    <Col md={'12'}>
                      <h4>Special Abilities</h4>
                    </Col>
                    {npc.monster_special_abilities.map((ability) => (
                      <CopyField placeHolder={ability.name}
                                 key={ability.id}
                                 fieldId={`npcSpecialAbility${ability.id}`}
                                 label={ability.name}
                                 copySuccess={copySuccess}
                                 setCopySuccess={setCopySuccess}
                                 colWidth={'12'}
                                 isTextArea
                                 text={ability.description} />
                    )) }
                  </Row>
                </Col>
              ) : null}
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
