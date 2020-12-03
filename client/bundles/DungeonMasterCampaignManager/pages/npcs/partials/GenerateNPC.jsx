/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../../actions/api';
import {connect} from 'react-redux';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {Form as FinalForm} from 'react-final-form';
import createDecorator from 'final-form-calculate';
import snakecaseKeys from 'snakecase-keys';

import {
  alignmentOptions,
  filterSnakeCaseOptionsWithData,
  getChallengeRatingOptions,
  npcSizeOptions,
} from '../../../utilities/character-utilities';
import FormSelect from '../../../components/forms/FormSelect';
import NameFormField from './NameFormField';
import NpcVariationSelect from './NpcVariationSelect';
import MonsterTypeSelect from './MonsterTypeSelect';
import RaceSelect from '../../characters/partials/races/RaceSelect';
import FormField from '../../../components/forms/FormField';

const npcFormDecorator = createDecorator(
  {
    field: 'characterAlignment',
    updates: {
      alignment: ((value) => value.value),
    },
  },
  {
    field: 'monsterType',
    updates: {
      npcVariant: ((value) => (value.value === 'humanoid' ? {
        label: 'Fighter',
        value: 'fighter',
      } : {
        label: 'Creature',
        value: 'creature',
      })),
    },
  }
);

class GenerateNPC extends React.Component {
  state = {
    npc: {
      name: 'New NPC',
      alignment: 'Neutral',
      challengeRating: {
        label: '0',
        value: '0',
      },
      npcVariant: {
        label: 'Fighter',
        value: 'fighter'},
      size: {
        label: 'Medium',
        value: 'medium',
      },
      characterAlignment: {
        value: 'Neutral',
        label: 'Neutral',
      },
      monsterType: {
        value: 'humanoid',
        label: 'Humanoid',
      },
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    monsterSubtypeOptions: [],
    challengeRatingOptions: [],
    validated: false,
  };

  componentDidMount () {
    this.setState({
      challengeRatingOptions: getChallengeRatingOptions(),
    });
  }

  handleGenerateName = (gender, race, callback) => {
    const apiURL = `/v1/random_fantasy_name?random_npc_gender=${gender}&random_npc_race=${race ? race : 'human'}`;
    fetch(apiURL)
      .then((response) => response.json())
      .then((jsonResult) => {
        callback(jsonResult.name);
      });
  };

  handleSubmit = async (values) => {
    const npc = {
      name: values.name,
      alignment: values.alignment,
      challengeRating: values.challengeRating.value,
      npcVariant: values.npcVariant.value,
      monsterType: values.monsterType.value,
      monsterSubtype: values.monsterSubtype,
      size: values.size.value,
      strength: values.strength,
      dexterity: values.dexterity,
      constitution: values.constitution,
      intelligence: values.intelligence,
      wisdom: values.wisdom,
      charisma: values.charisma,
    };
    this.props.generateNonPlayerCharacter(snakecaseKeys(npc));
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Character name is required.';
    }
    if (!values.alignment) {
      errors.characterAlignment = 'Character alignment is required.';
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
    return errors;
  };

  render () {
    const {npc, validated} = this.state;
    return (
      <FinalForm onSubmit={this.handleSubmit}
                 decorators={[npcFormDecorator]}
                 initialValues={npc}
                 validate={this.validate}
                 mutators={{...arrayMutators}}
                 render={({
                   handleSubmit,
                   form: {
                     mutators: {push},
                   },
                   submitting,
                   form,
                   pristine,
                   values,
                 }) => (
                   <Form noValidate validated={validated} onSubmit={handleSubmit}>
                     <Form.Row>
                       <NameFormField colWidth={'12'} values={values} handleGenerateName={this.handleGenerateName}/>
                     </Form.Row>
                     <Form.Row>
                       <MonsterTypeSelect colWidth={values.monsterType.value === 'humanoid' ? '4' : '12'} />
                       {values.monsterType.value === 'humanoid' ? (
                         <RaceSelect colWidth={'4'}/>
                       ) : null}
                       {values.monsterType.value === 'humanoid' ? (
                         <NpcVariationSelect colWidth={'4'}/>
                       ) : null}
                     </Form.Row>
                     <Form.Row>
                       <FormField label={'STR'} type={'number'} colWidth={'2'} name={'strength'}/>
                       <FormField label={'DEX'} type={'number'} colWidth={'2'} name={'dexterity'}/>
                       <FormField label={'CON'} type={'number'} colWidth={'2'} name={'constitution'}/>
                       <FormField label={'INT'} type={'number'} colWidth={'2'} name={'intelligence'}/>
                       <FormField label={'WIS'} type={'number'} colWidth={'2'} name={'wisdom'}/>
                       <FormField label={'CHA'} type={'number'} colWidth={'2'} name={'charisma'}/>
                     </Form.Row>
                     <Form.Row>
                       <FormSelect label={'Alignment'}
                                   colWidth={'3'}
                                   name={'characterAlignment'}
                                   value={values.alignment}
                                   options={alignmentOptions}/>
                       <FormSelect label={'Challenge Rating'}
                                   colWidth={'3'}
                                   name={'challengeRating'}
                                   value={values.challengeRating}
                                   options={this.state.challengeRatingOptions}/>
                       <FormSelect label={'Size'}
                                   colWidth={'3'}
                                   name={'size'}
                                   value={values.size}
                                   options={npcSizeOptions}/>
                     </Form.Row>
                     <Form.Row>
                       <ButtonGroup aria-label="Character actions">
                         <Button type="submit" disabled={submitting}>Generate NPC</Button>
                         <Button type="button" onClick={form.reset} disabled={submitting || pristine}
                                 variant={'secondary'}>Reset</Button>
                       </ButtonGroup>
                     </Form.Row>
                   </Form>
                 )}
      />
    );
  }
}

GenerateNPC.propTypes = {
  generateNonPlayerCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    flashMessages: state.flashMessages,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    generateNonPlayerCharacter: (npc) => {
      console.log(npc);
      dispatch(rest.actions.generateNonPlayerCharacter(npc));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateNPC);