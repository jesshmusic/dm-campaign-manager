/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import Frame from '../../components/Frame';
import { useForm } from 'react-hook-form';

const Convert2eMonster = (props) => {
  const { register, handleSubmit } = useForm();

  const [state, setState] = React.useState({
    monster: {
      name: '',
      alignment: 'Neutral',
      characterAlignment: {
        value: 'Neutral',
        label: 'Neutral'
      },
      characterRace: {
        value: 'human',
        label: 'Human'
      },
      armorClass: 10,
      hitPoints: 10,
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
      thaco: 10,
      numberOfAttacks: 1,
      speed: '12',
      actions: [],
      dndClasses: []
    },
    validated: false
  });

  // const handleSubmit = async (values) => {
  //   const monster = get2eMonsterObject(values);
  //   this.props.generateNonPlayerCharacter(snakecaseKeys(monster));
  // };

  // const validate = (values) => {
  //   const errors = {};
  //   if (!values.name) {
  //     errors.name = 'Character name is required.';
  //   }
  //   if (!values.alignment) {
  //     errors.alignmentOption = 'Character alignment is required.';
  //   }
  //   if (!values.charisma) {
  //     errors.charisma = 'Charisma is required';
  //   }
  //   if (!values.constitution) {
  //     errors.constitution = 'Constitution is required';
  //   }
  //   if (!values.dexterity) {
  //     errors.dexterity = 'Dexterity is required';
  //   }
  //   if (!values.intelligence) {
  //     errors.intelligence = 'Intelligence is required';
  //   }
  //   if (!values.strength) {
  //     errors.strength = 'Strength is required';
  //   }
  //   if (!values.wisdom) {
  //     errors.wisdom = 'Wisdom is required';
  //   }
  //   if (!values.thaco) {
  //     errors.thaco = 'THAC0 is required';
  //   }
  //   if (!values.armorClass) {
  //     errors.armorClass = 'Armor Class is required';
  //   }
  //   if (!values.hitPoints) {
  //     errors.hitPoints = 'Hit Points are required';
  //   }
  //   if (!values.dndClasses || values.dndClasses.length < 1) {
  //     errors.dndClasses = 'At least one Class is required';
  //   }
  //   return errors;
  // };
  const { monster, validated } = state;
  return (
    <Frame title='D&D 2nd Edition Monster Convertor'
           subtitle='Enter stats for a 2E Monster to generate its 5E equivalent (roughly) for humanoid Monsters.'>

      {/* <Form noValidate validated={ validated } onSubmit={ handleSubmit }>
      //   <Row>
      //     <FormField label={ 'Name' }
      //                type={ 'text' }
      //                register={ register }
      //                name={ 'name' } />
      //     <RaceSelect colWidth={ '4' } />
      //   </Row>
      //   <h3>Classes</h3>
      //   <Row>
      //     <Col md={ '12' } className={ 'mb-5' }>
      //
      //       <CharacterClassFields characterClass={ defaultFighterClass }
      //                             fields={ [] }
      //                             index={ 1 }
      //                             key={ 1 } />
      //       <Button type='button'
      //               onClick={ () => true }
      //               variant={ 'info' }
      //               size={ 'lg' }>
      //         Add Class
      //       </Button>
      //     </Col>
      //   </Row>
      //   <Row>
      //     <FormField label={ 'THAC0' }
      //                type={ 'number' }
      //                register={ register }
      //                name={ 'thaco' } />
      //     <FormField label={ 'Armor Class' }
      //                type={ 'number' }
      //                register={ register }
      //                name={ 'armorClass' } />
      //     <FormField label={ 'Hit Points' }
      //                type={ 'number' }
      //                register={ register }
      //                name={ 'hitPoints' } />
      //   </Row>
      //   <Row>
      //     <AbilityScoreField label={ 'STR' } type={ 'number' } colWidth={ '2' } name={ 'strength' }
      //                        hideRoll />
      //     <AbilityScoreField label={ 'DEX' } type={ 'number' } colWidth={ '2' } name={ 'dexterity' }
      //                        hideRoll />
      //     <AbilityScoreField label={ 'CON' } type={ 'number' } colWidth={ '2' } name={ 'constitution' }
      //                        hideRoll />
      //     <AbilityScoreField label={ 'INT' } type={ 'number' } colWidth={ '2' } name={ 'intelligence' }
      //                        hideRoll />
      //     <AbilityScoreField label={ 'WIS' } type={ 'number' } colWidth={ '2' } name={ 'wisdom' }
      //                        hideRoll />
      //     <AbilityScoreField label={ 'CHA' } type={ 'number' } colWidth={ '2' } name={ 'charisma' }
      //                        hideRoll />
      //   </Row>
      //   <Row>
      //     <FormSelect label={ 'Alignment' }
      //                 name={ 'alignmentOption' }
      //                 options={ alignmentOptions } />
      //     <FormField label={ 'Number of Attacks' }
      //                type={ 'number' }
      //                register={ register }
      //                name={ 'numberOfAttacks' } />
      //     <FormField label={ 'Speed (MV)' }
      //                type={ 'number' }
      //                register={ register }
      //                name={ 'speed' } />
      //   </Row>
      //   <Row className={ 'mb-4' }>
      //     <Col md={ '12' }>
      //       <h3>Actions</h3>
      //
      //       <ActionForm name={ 'temp' }
      //                   title={ 'Actions' }
      //                   singularTitle={ 'Action' }
      //                   register={ register } />
      //
      //       <Button type='button'
      //               variant={ 'info' }
      //               size={ 'lg' }>Add Action</Button>
      //     </Col>
      //   </Row>
      //   <Row className={ 'mb-4' }>
      //     <ButtonGroup aria-label='Character actions'>
      {/*      <Button type='submit'>Convert Monster</Button>*/ }
      {/*      <Button type='button'*/ }
      {/*              variant={ 'secondary' }>Reset</Button>*/ }
      {/*    </ButtonGroup>*/ }
      {/*  </Row>*/ }
      {/*</Form>*/ }
    </Frame>
  );
};

export default Convert2eMonster;

// Convert2eMonster.propTypes = {
//   generateNonPlayerCharacter: PropTypes.func.isRequired,
//   user: PropTypes.object
// };
//
// function mapStateToProps (state) {
//   return {
//     flashMessages: state.flashMessages,
//     user: state.users.user
//   };
// }
//
// function mapDispatchToProps (dispatch) {
//   return {
//     generateNonPlayerCharacter: (monster) => {
//       dispatch(rest.actions.convert2eNonPlayerCharacter({}, { body: JSON.stringify(monster) }));
//     }
//   };
// }
//
// export default connect(mapStateToProps, mapDispatchToProps)(Convert2eMonster);