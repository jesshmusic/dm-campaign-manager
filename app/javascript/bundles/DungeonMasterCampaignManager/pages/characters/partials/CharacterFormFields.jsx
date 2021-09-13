/**
 * Created by jesshendricks on 10/12/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import FormField from '../../../components/forms/FormField';
import Accordion from 'react-bootstrap/Accordion';
import NameField from '../../../components/NameField';
import FormSelect from '../../../components/forms/FormSelect';
import {alignmentOptions, WeaponState} from '../../../utilities/character-utilities';
import RaceSelect from '../../npcs/partials/RaceSelect';
import FormRichTextArea from '../../../components/forms/FormRichTextArea';
import Col from 'react-bootstrap/Col';
import {FieldArray} from 'react-final-form-arrays';
import CharacterClassFields from '../../npcs/partials/CharacterClassFields';
import Button from 'react-bootstrap/Button';
import ArmorSelect from './items/ArmorSelect';
import WeaponRadios from './items/WeaponRadios';
import WeaponRHSelect from './items/WeaponRHSelect';
import WeaponLHSelect from './items/WeaponLHSelect';
import ShieldSelect from './items/ShieldSelect';
import Weapon2HSelect from './items/Weapon2HSelect';
import CharacterItemFields from './items/CharacterItemFields';
import BardSpellSelect from '../../npcs/partials/spell-fields/BardSpellSelect';
import ClericSpellSelect from '../../npcs/partials/spell-fields/ClericSpellSelect';
import DruidSpellSelect from '../../npcs/partials/spell-fields/DruidSpellSelect';
import PaladinSpellSelect from '../../npcs/partials/spell-fields/PaladinSpellSelect';
import RangerSpellSelect from '../../npcs/partials/spell-fields/RangerSpellSelect';
import SorcererSpellSelect from '../../npcs/partials/spell-fields/SorcererSpellSelect';
import WarlockSpellSelect from '../../npcs/partials/spell-fields/WarlockSpellSelect';
import WizardSpellSelect from '../../npcs/partials/spell-fields/WizardSpellSelect';
import SectionHeading from '../../../components/SectionHeading';
import Row from 'react-bootstrap/Row';

const CharacterFormFields = ({dirty, errors, guildOptions, isNPC, values}) => {
  return (
    <div>
      { dirty && errors && Object.keys(errors).length > 0 ? (
        <Alert variant={ 'danger' }>
          <Alert.Heading>Required fields</Alert.Heading>
          <ul>
            { Object.keys(errors).map((keyName, i) =>
              <li key={ i }>
                { errors[keyName] }
              </li>,
            ) }
          </ul>
        </Alert>
      ) : null }
      { isNPC ? (
        <Row>
          <FormField
            label={ 'NPC Role' }
            type={ 'text' }
            colWidth={ '12' }
            name={ 'role' }
            infoText={ '(Villain, Lord, Blacksmith, etc.)' }
          />
        </Row>
      ) : null }
      <Accordion>
        <Row>
          <NameField colWidth={ '3' } value={ values.name }/>
          <FormSelect label={ 'Alignment' }
                      colWidth={ '3' }
                      name={ 'characterAlignment' }
                      options={ alignmentOptions }/>
          <RaceSelect colWidth={ '3' }/>
          <FormField label={ 'Background' } type={ 'text' } colWidth={ '3' } name={ 'background' }/>
        </Row>
        <Row>
          <FormRichTextArea label={ 'Description' } colWidth={ '6' } name={ 'description' }/>
          <FormField label={ 'Languages' } type={ 'text' } colWidth={ '3' } name={ 'languages' }/>
          <FormSelect label={ 'Guild or Affiliation' }
                      colWidth={ '3' }
                      isClearable
                      name={ 'guild' }
                      options={ guildOptions }/>
        </Row>
        <SectionHeading eventKey={ '0' } title={ 'Classes' }/>
        <Accordion.Collapse eventKey={ '0' }>
          <Row>
            <Col md={ {span: 8, offset: 2} }>
              <FieldArray name="dndClasses">
                { ({fields}) => (
                  fields.map((characterClass, index) => (
                    !fields.value[index] || !fields.value[index]._destroy ? (
                      <CharacterClassFields characterClass={ characterClass }
                                            fields={ fields }
                                            index={ index }
                                            key={ index }/>
                    ) : null
                  ))
                ) }
              </FieldArray>
              <Button type="button" onClick={ () => push('dndClasses', {
                dndClass: {
                  value: 153,
                  label: 'Fighter',
                },
                level: 1,
              }) } variant={ 'info' } size={ 'lg' }>Add Class</Button>
            </Col>
          </Row>
        </Accordion.Collapse>
        <SectionHeading eventKey={ '1' } title={ 'Statistics' }/>
        <Accordion.Collapse eventKey={ '1' }>
          <Row>
            <FormField label={ 'Armor Class' } type={ 'number' } colWidth={ '2' } name={ 'armorClass' }
                       readOnly/>
            <FormField label={ 'AC Mod' }
                       type={ 'number' }
                       colWidth={ '2' }
                       name={ 'armorClassModifier' }
                       infoText={ 'Magic item or special ability' }
            />
            <FormField label={ 'Hit Points' } type={ 'number' } colWidth={ '4' } name={ 'hitPoints' }/>
            <FormField label={ 'Experience Points' } type={ 'number' } colWidth={ '4' } name={ 'xp' }/>
          </Row>
        </Accordion.Collapse>
        <SectionHeading eventKey={ '2' } title={ 'Ability Scores' }/>
        <Accordion.Collapse eventKey={ '2' }>
          <div>
            <Row>
              <FormField label={ 'Use Race Modifiers' }
                         name={ 'applyRaceMods' }
                         colWidth={ '12' }
                         type={ 'checkbox' }
                         infoText={ 'Add racial bonuses to ability scores.' }
              />
            </Row>
            <Row>
              <FormField label={ 'STR' } type={ 'number' } colWidth={ '2' } name={ 'strength' }/>
              <FormField label={ 'DEX' } type={ 'number' } colWidth={ '2' } name={ 'dexterity' }/>
              <FormField label={ 'CON' } type={ 'number' } colWidth={ '2' } name={ 'constitution' }/>
              <FormField label={ 'INT' } type={ 'number' } colWidth={ '2' } name={ 'intelligence' }/>
              <FormField label={ 'WIS' } type={ 'number' } colWidth={ '2' } name={ 'wisdom' }/>
              <FormField label={ 'CHA' } type={ 'number' } colWidth={ '2' } name={ 'charisma' }/>
            </Row>
          </div>
        </Accordion.Collapse>
        <SectionHeading eventKey={ '3' } title={ 'Coin' }/>
        <Accordion.Collapse eventKey={ '3' }>
          <Row>
            <FormField label={ 'Copper' } type={ 'number' } colWidth={ '2' } name={ 'copperPieces' }/>
            <FormField label={ 'Silver' } type={ 'number' } colWidth={ '2' } name={ 'silverPieces' }/>
            <FormField label={ 'Electrum' } type={ 'number' } colWidth={ '2' } name={ 'electrumPieces' }/>
            <FormField label={ 'Gold' } type={ 'number' } colWidth={ '2' } name={ 'goldPieces' }/>
            <FormField label={ 'Platinum' } type={ 'number' } colWidth={ '2' } name={ 'platinumPieces' }/>
          </Row>
        </Accordion.Collapse>
        <SectionHeading eventKey={ '4' } title={ 'Equipment' }/>
        <Accordion.Collapse eventKey={ '4' }>
          <div>
            <h3>Armor and Weapons</h3>
            <Row>
              <ArmorSelect colWidth={ '12' }/>
            </Row>
            <WeaponRadios/>
            { values.weaponState === WeaponState.SINGLE ? (
              <Row>
                <WeaponRHSelect colWidth={ '12' }/>
              </Row>
            ) : null }
            { values.weaponState === WeaponState.DUAL ? (
              <Row>
                <WeaponRHSelect colWidth={ '6' }/>
                <WeaponLHSelect colWidth={ '6' }/>
              </Row>
            ) : null }
            { values.weaponState === WeaponState.SHIELD ? (
              <Row>
                <WeaponRHSelect colWidth={ '6' }/>
                <ShieldSelect colWidth={ '6' }/>
              </Row>
            ) : null }
            { values.weaponState === WeaponState.TWOHAND ? (
              <Row>
                <Weapon2HSelect colWidth={ '12' }/>
              </Row>
            ) : null }
            <h3>Gear</h3>
            <Row>
              <Col md={ {span: 8, offset: 2} }>
                <FieldArray name="characterItems">
                  { ({fields}) =>
                    fields.map((characterItem, index) => (
                      !fields.value[index] || !fields.value[index]._destroy ? (
                        <CharacterItemFields characterItem={ characterItem }
                                             fields={ fields }
                                             index={ index }
                                             key={ index }
                                             label={ fields.value[index].label }/>
                      ) : null
                    ))
                  }
                </FieldArray>
                <Button type="button" onClick={ () => push('characterItems', {
                  quantity: 1,
                  label: 'Item',
                  carrying: true,
                }) } variant={ 'info' } size={ 'lg' }>Add Item</Button>
              </Col>
            </Row>
          </div>
        </Accordion.Collapse>
        <SectionHeading eventKey={ '5' } title={ 'Spellcasting' }/>
        <Accordion.Collapse eventKey={ '5' }>
          <div>
            <BardSpellSelect showBardSpells={ values.showBardSpells }/>
            <ClericSpellSelect showClericSpells={ values.showClericSpells }/>
            <DruidSpellSelect showDruidSpells={ values.showDruidSpells }/>
            <PaladinSpellSelect showPaladinSpells={ values.showPaladinSpells }/>
            <RangerSpellSelect showRangerSpells={ values.showRangerSpells }/>
            <SorcererSpellSelect showSorcererSpells={ values.showSorcererSpells }/>
            <WarlockSpellSelect showWarlockSpells={ values.showWarlockSpells }/>
            <WizardSpellSelect showWizardSpells={ values.showWizardSpells }/>
          </div>
        </Accordion.Collapse>
      </Accordion>
    </div>
  );
};

CharacterFormFields.propTypes = {
  dirty: PropTypes.bool,
  errors: PropTypes.object,
  guildOptions: PropTypes.array.isRequired,
  isNPC: PropTypes.bool,
  values: PropTypes.object.isRequired,
};

export default CharacterFormFields;