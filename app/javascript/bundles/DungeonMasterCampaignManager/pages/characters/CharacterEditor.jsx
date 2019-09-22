/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';

import {Form as FinalForm} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import {FieldArray} from 'react-final-form-arrays';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import FormField from '../../components/forms/FormField';
import FormSelect from '../../components/forms/FormSelect';
import FormTextArea from '../../components/forms/FormTextArea';
import CharacterClassFields from './partials/CharacterClassFields';
// Spell Selects
import BardSpellSelect from './partials/spell-fields/BardSpellSelect';
import ClericSpellSelect from './partials/spell-fields/ClericSpellSelect';
import DruidSpellSelect from './partials/spell-fields/DruidSpellSelect';
import PaladinSpellSelect from './partials/spell-fields/PaladinSpellSelect';
import RangerSpellSelect from './partials/spell-fields/RangerSpellSelect';
import SorcererSpellSelect from './partials/spell-fields/SorcererSpellSelect';
import WarlockSpellSelect from './partials/spell-fields/WarlockSpellSelect';
import WizardSpellSelect from './partials/spell-fields/WizardSpellSelect';

import classes from './partials/character-form.module.scss';
import {
  alignmentOptions,
  characterCalculations,
  getCharacterObject,
  SetupCharacterState,
  WeaponState,
} from '../../utilities/character-utilities';

import RaceSelect from './partials/races/RaceSelect';
import ArmorSelect from './partials/items/ArmorSelect';
import ShieldSelect from './partials/items/ShieldSelect';
import WeaponLHSelect from './partials/items/WeaponLHSelect';
import WeaponRHSelect from './partials/items/WeaponRHSelect';
import Weapon2HSelect from './partials/items/Weapon2HSelect';
import WeaponRadios from './partials/items/WeaponRadios';
import CharacterItemFields from './partials/items/CharacterItemFields';
import Accordion from 'react-bootstrap/Accordion';
import useAccordionToggle from 'react-bootstrap/useAccordionToggle';
import {FiChevronDown} from 'react-icons/all';
import Alert from 'react-bootstrap/Alert';
import NameField from './partials/NameField';

const SectionHeading = ({title, eventKey}) => {
  const decoratedOnClick = useAccordionToggle(eventKey);

  return (
    <Button variant="link" size="lg" className={'mt-3'} block onClick={decoratedOnClick}>
      <h2>{title} <FiChevronDown/></h2>
    </Button>
  );
};
SectionHeading.propTypes = {
  eventKey: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};


class CharacterEditor extends React.Component {
  state = {
    character: null,
    validated: false,
  };

  componentDidMount () {
    this.setState({
      character: SetupCharacterState(this.props.character),
    });
  }

  handleSubmit = async (values) => {
    const parsedChar = getCharacterObject(values);
    if (parsedChar.id) {
      this.props.updateCharacter(parsedChar, this.props.campaignSlug, this.props.characterSlug);
    } else {
      this.props.createCharacter(parsedChar, this.props.campaignSlug);
    }
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Character name is required';
    }
    if (!values.hitPoints) {
      errors.hitPoints = 'Hit points value is required';
    }
    if (!values.characterAlignment) {
      errors.characterAlignment = 'Alignment is required';
    }
    if (!values.charisma) {
      errors.charisma = 'Charisma is required';
    }
    if (!values.constitution) {
      errors.constitution = 'Constitution is required';
    }
    if (!values.dexterity) {
      errors.dexterity = 'Dexterity is required';
    }
    if (!values.intelligence) {
      errors.intelligence = 'Intelligence is required';
    }
    if (!values.strength) {
      errors.strength = 'Strength is required';
    }
    if (!values.wisdom) {
      errors.wisdom = 'Wisdom is required';
    }
    if (!values.dndClasses || values.dndClasses.length < 1) {
      errors.dndClasses = 'At least one character class must be selected.';
    }
    return errors;
  };

  render () {
    const {character, validated} = this.state;
    return (
      <FinalForm onSubmit={this.handleSubmit}
                 initialValues={character}
                 validate={this.validate}
                 decorators={[characterCalculations]}
                 mutators={{...arrayMutators}}
                 render={({
                   handleSubmit,
                   dirty,
                   errors,
                   form: {
                     mutators: {push},
                   },
                   invalid,
                   submitting,
                   form,
                   pristine,
                   values,
                 }) => (
                   <Form noValidate validated={validated} onSubmit={handleSubmit}>
                     {dirty && errors && Object.keys(errors).length > 0 ? (
                       <Alert variant={'danger'}>
                         <Alert.Heading>Required fields</Alert.Heading>
                         <ul>
                           {Object.keys(errors).map((keyName, i) =>
                             <li key={i}>
                               {errors[keyName]}
                             </li>,
                           )}
                         </ul>
                       </Alert>
                     ) : null}
                     {this.props.isNPC ? (
                       <Form.Row>
                         <FormField
                           label={'NPC Role'}
                           type={'text'}
                           colWidth={'12'}
                           name={'role'}
                           infoText={'(Villain, Lord, Blacksmith, etc.)'}
                         />
                       </Form.Row>
                     ) : null}
                     <Accordion>
                       <Form.Row>
                         <NameField colWidth={'3'} value={values.name}/>
                         <FormSelect label={'Alignment'} colWidth={'3'} name={'characterAlignment'}
                                     options={alignmentOptions}/>
                         <RaceSelect colWidth={'3'}/>
                         <FormField label={'Background'} type={'text'} colWidth={'3'} name={'background'}/>
                       </Form.Row>
                       <Form.Row>
                         <FormTextArea label={'Description'} colWidth={'7'} name={'description'}/>
                         <FormField label={'Languages'} type={'text'} colWidth={'5'} name={'languages'}/>
                       </Form.Row>
                       <SectionHeading eventKey={'0'} title={'Classes'}/>
                       <Accordion.Collapse eventKey={'0'}>
                         <Form.Row>
                           <Col md={{span: 8, offset: 2}}>
                             <FieldArray name="dndClasses">
                               {({fields}) => (
                                 fields.map((characterClass, index) => (
                                   !fields.value[index] || !fields.value[index]._destroy ? (
                                     <CharacterClassFields characterClass={characterClass}
                                                           fields={fields}
                                                           index={index}
                                                           key={index}/>
                                   ) : null))
                               )}
                             </FieldArray>
                             <Button type="button" onClick={() => push('dndClasses', {
                               dndClass: {
                                 value: 153,
                                 label: 'Fighter',
                               },
                               level: 1,
                             })} variant={'info'} block>Add Class</Button>
                           </Col>
                         </Form.Row>
                       </Accordion.Collapse>
                       <SectionHeading eventKey={'1'} title={'Statistics'}/>
                       <Accordion.Collapse eventKey={'1'}>
                         <Form.Row>
                           <FormField label={'Armor Class'} type={'number'} colWidth={'2'} name={'armorClass'}
                                      readOnly/>
                           <FormField label={'AC Mod'}
                                      type={'number'}
                                      colWidth={'2'}
                                      name={'armorClassModifier'}
                                      infoText={'Magic item or special ability'}
                           />
                           <FormField label={'Hit Points'} type={'number'} colWidth={'4'} name={'hitPoints'}/>
                           <FormField label={'Experience Points'} type={'number'} colWidth={'4'} name={'xp'}/>
                         </Form.Row>
                       </Accordion.Collapse>
                       <SectionHeading eventKey={'2'} title={'Ability Scores'}/>
                       <Accordion.Collapse eventKey={'2'}>
                         <div>
                           <Form.Row>
                             <FormField label={'Use Race Modifiers'}
                                        name={'applyRaceMods'}
                                        colWidth={'12'}
                                        type={'checkbox'}
                                        infoText={'Add racial bonuses to ability scores.'}
                             />
                           </Form.Row>
                           <Form.Row>
                             <FormField label={'STR'} type={'number'} colWidth={'2'} name={'strength'}/>
                             <FormField label={'DEX'} type={'number'} colWidth={'2'} name={'dexterity'}/>
                             <FormField label={'CON'} type={'number'} colWidth={'2'} name={'constitution'}/>
                             <FormField label={'INT'} type={'number'} colWidth={'2'} name={'intelligence'}/>
                             <FormField label={'WIS'} type={'number'} colWidth={'2'} name={'wisdom'}/>
                             <FormField label={'CHA'} type={'number'} colWidth={'2'} name={'charisma'}/>
                           </Form.Row>
                         </div>
                       </Accordion.Collapse>
                       <SectionHeading eventKey={'3'} title={'Coin'}/>
                       <Accordion.Collapse eventKey={'3'}>
                         <Form.Row>
                           <FormField label={'Copper'} type={'number'} colWidth={'2'} name={'copperPieces'}/>
                           <FormField label={'Silver'} type={'number'} colWidth={'2'} name={'silverPieces'}/>
                           <FormField label={'Electrum'} type={'number'} colWidth={'2'} name={'electrumPieces'}/>
                           <FormField label={'Gold'} type={'number'} colWidth={'2'} name={'goldPieces'}/>
                           <FormField label={'Platinum'} type={'number'} colWidth={'2'} name={'platinumPieces'}/>
                         </Form.Row>
                       </Accordion.Collapse>
                       <SectionHeading eventKey={'4'} title={'Equipment'}/>
                       <Accordion.Collapse eventKey={'4'}>
                         <div>
                           <h3>Armor and Weapons</h3>
                           <Form.Row>
                             <ArmorSelect colWidth={'12'}/>
                           </Form.Row>
                           <WeaponRadios/>
                           {values.weaponState === WeaponState.SINGLE ? (
                             <Form.Row>
                               <WeaponRHSelect colWidth={'12'}/>
                             </Form.Row>
                           ) : null}
                           {values.weaponState === WeaponState.DUAL ? (
                             <Form.Row>
                               <WeaponRHSelect colWidth={'6'}/>
                               <WeaponLHSelect colWidth={'6'}/>
                             </Form.Row>
                           ) : null}
                           {values.weaponState === WeaponState.SHIELD ? (
                             <Form.Row>
                               <WeaponRHSelect colWidth={'6'}/>
                               <ShieldSelect colWidth={'6'}/>
                             </Form.Row>
                           ) : null}
                           {values.weaponState === WeaponState.TWOHAND ? (
                             <Form.Row>
                               <Weapon2HSelect colWidth={'12'}/>
                             </Form.Row>
                           ) : null}
                           <h3>Gear</h3>
                           <Form.Row>
                             <Col md={{span: 8, offset: 2}}>
                               <FieldArray name="characterItems">
                                 {({fields}) =>
                                   fields.map((characterItem, index) => (
                                     !fields.value[index] || !fields.value[index]._destroy ? (
                                       <CharacterItemFields characterItem={characterItem}
                                                            fields={fields}
                                                            index={index}
                                                            key={index}
                                                            label={fields.value[index].label}/>
                                     ) : null))
                                 }
                               </FieldArray>
                               <Button type="button" onClick={() => push('characterItems', {
                                 quantity: 1,
                                 label: 'Item',
                                 carrying: true,
                               })} variant={'info'} block>Add Item</Button>
                             </Col>
                           </Form.Row>
                         </div>
                       </Accordion.Collapse>
                       <SectionHeading eventKey={'5'} title={'Spellcasting'}/>
                       <Accordion.Collapse eventKey={'5'}>
                         <div>
                           <BardSpellSelect showBardSpells={values.showBardSpells}/>
                           <ClericSpellSelect showClericSpells={values.showClericSpells}/>
                           <DruidSpellSelect showDruidSpells={values.showDruidSpells}/>
                           <PaladinSpellSelect showPaladinSpells={values.showPaladinSpells}/>
                           <RangerSpellSelect showRangerSpells={values.showRangerSpells}/>
                           <SorcererSpellSelect showSorcererSpells={values.showSorcererSpells}/>
                           <WarlockSpellSelect showWarlockSpells={values.showWarlockSpells}/>
                           <WizardSpellSelect showWizardSpells={values.showWizardSpells}/>
                         </div>
                       </Accordion.Collapse>
                       <Form.Row>
                         <ButtonGroup aria-label="Character actions">
                           <Button type="submit" disabled={submitting || invalid}>Save</Button>
                           <Button type="button" onClick={form.reset} disabled={submitting || pristine}
                                   variant={'secondary'}>Reset</Button>
                         </ButtonGroup>
                       </Form.Row>
                     </Accordion>
                     <pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>
                   </Form>
                 )}
      />
    );
  }
}

CharacterEditor.propTypes = {
  campaignSlug: PropTypes.string.isRequired,
  character: PropTypes.object.isRequired,
  characterSlug: PropTypes.string,
  createCharacter: PropTypes.func.isRequired,
  isNPC: PropTypes.bool,
  updateCharacter: PropTypes.func.isRequired,
};

export default CharacterEditor;