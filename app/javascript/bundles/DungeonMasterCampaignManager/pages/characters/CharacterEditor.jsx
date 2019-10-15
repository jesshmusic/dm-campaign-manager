/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';

import {Form as FinalForm} from 'react-final-form';
import arrayMutators from 'final-form-arrays';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

// import classes from './partials/character-form.module.scss';
import {
  characterCalculations,
  getCharacterObject,
  SetupCharacterState,
} from '../../utilities/character-utilities';
import CharacterFormFields from './partials/CharacterFormFields';
import Row from 'react-bootstrap/Row';


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

  componentDidUpdate (prevProps) {
    if (prevProps.character !== this.props.character ) {
      this.setState({character: SetupCharacterState(this.props.character)});
    }
  }

  handleSubmit = async (values) => {
    const parsedChar = getCharacterObject(values);
    if (parsedChar.id) {
      this.props.updateCharacter(parsedChar, this.props.campaignSlug, this.props.guildSlug, this.props.characterSlug);
    } else {
      this.props.createCharacter(parsedChar, this.props.campaignSlug, this.props.guildSlug);
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
    const {character, onCancelEditing, onDelete, validated} = this.state;
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
                     <Row>
                       <Col sm={{span: 12, order: 2}} md={{span: 10, order: 1}}>
                         <CharacterFormFields dirty={dirty} isNPC={this.props.isNPC} values={values} errors={errors}/>
                       </Col>
                       <Col sm={{span: 12, order: 1}} md={{span: 2, order: 2}} className={'pl-md-0'}>
                         <div className={'sticky-top py-3'}>
                           <Button type="submit" disabled={submitting || pristine} variant={'success'} block>
                             Save
                           </Button>
                           <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'link'} block>
                             Reset Form
                           </Button>
                           {onCancelEditing ? (
                             <Button type="button" onClick={onCancelEditing} variant={'link'} block>
                               Cancel
                             </Button>
                           ) : null}
                           {onDelete ? (
                             <Button type="button" variant={'link'} onClick={onDelete} block>
                               Delete Adventure
                             </Button>
                           ) : null}
                         </div>
                       </Col>
                     </Row>
                     {/*<pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>*/}
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
  guildSlug: PropTypes.string.isRequired,
  isNPC: PropTypes.bool,
  onDelete: PropTypes.func,
  onCancelEditing: PropTypes.func,
  updateCharacter: PropTypes.func.isRequired,
};

export default CharacterEditor;