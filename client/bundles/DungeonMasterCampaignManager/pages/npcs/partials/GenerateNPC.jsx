/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../../actions/api';
import {connect} from 'react-redux';

import {alignmentOptions} from '../../../utilities/character-utilities';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import FormField from '../../../components/forms/FormField';
import FormSelect from '../../../components/forms/FormSelect';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {Form as FinalForm} from 'react-final-form';
import snakecaseKeys from 'snakecase-keys';
import NameField from './NameField';
import RaceSelect from '../../characters/partials/races/RaceSelect';


class GenerateNPC extends React.Component {
  state = {
    npc: {
      name: '',
      alignment: '',
      monsterType: 'humanoid',
      characterRace: 'human',
      minScore: 15,
    },
    validated: false,
  };

  handleSubmit = async (values) => {
    const nonPlayerCharacter = {
      name: values.name,
      alignment: values.characterAlignment.value,
      minScore: values.minScore,
      monsterType: 'humanoid',
      monsterSubtype: values.characterRace.label,
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
                       <NameField colWidth={'5'} noFormWrapper/>
                       <FormField
                           label={'Min Score'}
                           type={'number'}
                           colWidth={'2'}
                           name={'minScore'}
                           infoText={'Make sure the primary ability is at least this score.'}
                       />
                     </Form.Row>
                     <Form.Row>
                       <FormSelect label={'Alignment'} colWidth={'6'} name={'characterAlignment'}
                                   options={alignmentOptions}/>
                       <RaceSelect colWidth={'6'}/>
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