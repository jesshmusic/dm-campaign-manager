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

import {alignmentOptions, getChallengeRatingOptions} from '../../../utilities/character-utilities';
import FormField from '../../../components/forms/FormField';
import FormSelect from '../../../components/forms/FormSelect';
import NameFormField from './NameFormField';
import RaceSelect from '../../characters/partials/races/RaceSelect';
import NpcVariationSelect from './NpcVariationSelect';

const npcFormDecorator = createDecorator(
  {
    field: 'characterAlignment',
    updates: {
      alignment: ((value) => value.value),
    },
  },
  {
    field: 'characterRace',
    updates: {
      monsterSubtype: ((value) => value.value),
    },
  }
);

class GenerateNPC extends React.Component {
  state = {
    npc: {
      name: '',
      alignment: '',
      monsterType: 'humanoid',
      challengeRating: '0',
      characterRace: 'human',
      npcVariant: 'fighter',
    },
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
    const nonPlayerCharacter = {
      name: values.name,
      alignment: values.alignment,
      challengeRating: values.challengeRating.value,
      npcVariant: values.npcVariant.value,
      monsterType: 'humanoid',
      monsterSubtype: values.monsterSubtype,
    };
    console.log(nonPlayerCharacter);
    // this.props.generateNonPlayerCharacter(snakecaseKeys(nonPlayerCharacter));
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Character name is required.';
    }
    if (!values.characterAlignment) {
      errors.characterAlignment = 'Character alignment is required.';
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
                       <NameFormField colWidth={'6'} values={values} handleGenerateName={this.handleGenerateName}/>
                       <NpcVariationSelect colWidth={'6'}/>
                     </Form.Row>
                     <Form.Row>
                       <FormSelect label={'Alignment'} colWidth={'4'} name={'characterAlignment'}
                                   options={alignmentOptions}/>
                       <RaceSelect colWidth={'5'}/>
                       <FormSelect label={'Challenge Rating'} colWidth={'3'} name={'challengeRating'}
                                   options={this.state.challengeRatingOptions}/>
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
    generateNonPlayerCharacter: (non_player_character) => {
      dispatch(rest.actions.generateNonPlayerCharacter(
        {body: JSON.stringify({non_player_character})},
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateNPC);