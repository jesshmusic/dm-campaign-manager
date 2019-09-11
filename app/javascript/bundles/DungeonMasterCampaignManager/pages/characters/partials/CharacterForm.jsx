/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FormField from '../../../components/forms/FormField';
import FormSelect from '../../../components/forms/FormSelect';
import FormTextArea from '../../../components/forms/FormTextArea';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {Form as FinalForm} from 'react-final-form';

import classes from './character-form.module.scss';
import Col from 'react-bootstrap/Col';
import {FieldArray} from 'react-final-form-arrays';
import CharacterClassFields from './CharacterClassFields';
import FormSelectAync from '../../../components/forms/FormSelectAsync';

const alignmentOptions = [
  { value: 'Lawful Good', label: 'Lawful Good' },
  { value: 'Neutral Good', label: 'Neutral Good' },
  { value: 'Chaotic Good', label: 'Chaotic Good' },
  { value: 'Lawful Neutral', label: 'Lawful Neutral' },
  { value: 'Neutral', label: 'Neutral' },
  { value: 'Chaotic Neutral', label: 'Chaotic Neutral' },
  { value: 'Lawful Evil', label: 'Lawful Evil' },
  { value: 'Neutral Evil', label: 'Neutral Evil' },
  { value: 'Chaotic Evil', label: 'Chaotic Evil' },
];

const FormComponent = ({
  validated,
  handleSubmit,
  submitting,
  submitButtonText,
  form,
  getArmor,
  pristine,
  values,
  dndClasses,
  races,
  push,
}) => (
  <Form noValidate validated={validated} onSubmit={handleSubmit}>
    <Form.Row>
      <FormField label={'Character name'}
                 type={'text'}
                 colWidth={'3'}
                 name={'name'}/>
      <FormSelect label={'Alignment'}
                  colWidth={'3'}
                  name={'characterAlignment'}
                  options={alignmentOptions}/>
      <FormSelect label={'Race'}
                  colWidth={'3'}
                  name={'characterRace'}
                  options={races.map((race) => ({value: race.id, label: race.name}))}/>
      <FormField label={'Background'}
                 type={'text'}
                 colWidth={'3'}
                 name={'background'}/>
    </Form.Row>
    <Form.Row>
      <FormTextArea label={'Description'} colWidth={'7'} name={'description'}/>
      <FormField label={'Languages'}
                 type={'text'}
                 colWidth={'5'}
                 name={'languages'}/>
    </Form.Row>
    <h2>Classes</h2>
    <Form.Row>
      <Col md={6}>
        <FieldArray name="dndClasses">
          {({ fields }) =>
            fields.map((characterClass, index) => (!fields.value[index] || !fields.value[index]._destroy ? (
              <CharacterClassFields characterClass={characterClass}
                                    fields={fields}
                                    index={index}
                                    key={index}
                                    dndClasses={dndClasses}/>
            ) : null))
          }
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
    <h2>Statistics</h2>
    <Form.Row>
      <FormField label={'Armor Class'}
                 type={'number'}
                 colWidth={'4'}
                 name={'armorClass'}/>
      <FormField label={'Hit Points'}
                 type={'number'}
                 colWidth={'4'}
                 name={'hitPoints'}/>
      <FormField label={'Experience Points'}
                 type={'number'}
                 colWidth={'4'}
                 name={'xp'}/>
    </Form.Row>
    <h2>Ability Scores</h2>
    <Form.Row>
      <FormField label={'STR'}
                 type={'number'}
                 colWidth={'2'}
                 name={'strength'}/>
      <FormField label={'DEX'}
                 type={'number'}
                 colWidth={'2'}
                 name={'dexterity'}/>
      <FormField label={'CON'}
                 type={'number'}
                 colWidth={'2'}
                 name={'constitution'}/>
      <FormField label={'INT'}
                 type={'number'}
                 colWidth={'2'}
                 name={'intelligence'}/>
      <FormField label={'WIS'}
                 type={'number'}
                 colWidth={'2'}
                 name={'wisdom'}/>
      <FormField label={'CHA'}
                 type={'number'}
                 colWidth={'2'}
                 name={'charisma'}/>
    </Form.Row>
    <h2>Coin</h2>
    <Form.Row>
      <FormField label={'Copper'}
                 type={'number'}
                 colWidth={'2'}
                 name={'copperPieces'}/>
      <FormField label={'Silver'}
                 type={'number'}
                 colWidth={'2'}
                 name={'silverPieces'}/>
      <FormField label={'Electrum'}
                 type={'number'}
                 colWidth={'2'}
                 name={'electrumPieces'}/>
      <FormField label={'Gold'}
                 type={'number'}
                 colWidth={'2'}
                 name={'goldPieces'}/>
      <FormField label={'Platinum'}
                 type={'number'}
                 colWidth={'2'}
                 name={'platinumPieces'}/>
    </Form.Row>
    <h2>Equipment</h2>
    <h3>Armor</h3>
    <Form.Row>
      <FormSelectAync
        label={'Armor'}
        colWidth={'12'}
        name={'character_items[item]'}
        getOptions={getArmor}
        isMulti
      />
    </Form.Row>
    <Form.Row>
      <ButtonGroup aria-label="Character actions">
        <Button type="submit" disabled={submitting}>{submitButtonText}</Button>
        <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'secondary'}>Reset</Button>
      </ButtonGroup>
    </Form.Row>
    <pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>
  </Form>
);

FormComponent.propTypes = {
  validated: PropTypes.bool,
  handleSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  submitButtonText: PropTypes.string.isRequired,
  form: PropTypes.any,
  getArmor: PropTypes.func.isRequired,
  pristine: PropTypes.bool,
  values: PropTypes.object,
  dndClasses: PropTypes.array.isRequired,
  races: PropTypes.array.isRequired,
  push: PropTypes.func.isRequired,
};

class CharacterForm extends React.Component {

  handleSubmit = async (values) => {
    const newChar = {
      name: values.name,
      alignment: values.characterAlignment.value,
      description: values.description,
      race_id: values.characterRace.value,
      character_classes_attributes: values.dndClasses.map((dndClass) => {
        const returnClass = {
          level: dndClass.level,
          dnd_class_id: dndClass.dndClass.value,
        };
        if (dndClass.id) {
          returnClass.id = dndClass.id;
        }
        return returnClass;
      }),
    };
    this.props.onFormSubmit(newChar);
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Character name is required';
    }
    return errors;
  };

  render () {
    const {
      arrayMutators,
      dndClasses,
      getArmor,
      initialValues,
      races,
      submitButtonText,
      validated,
      validateForm,
    } = this.props;

    return (
      <FinalForm onSubmit={this.handleSubmit}
                 initialValues={initialValues}
                 validate={validateForm}
                 mutators={{...arrayMutators }}
                 render={({
                   handleSubmit,
                   form: {
                     mutators: { push },
                   },
                   submitting,
                   form,
                   pristine,
                   values,
                 }) => <FormComponent submitButtonText={submitButtonText}
                                      handleSubmit={handleSubmit}
                                      validated={validated}
                                      submitting={submitting}
                                      form={form}
                                      pristine={pristine}
                                      values={values}
                                      dndClasses={dndClasses}
                                      races={races}
                                      push={push}
                                      getArmor={getArmor}/>}
      />
    );
  }
}

CharacterForm.propTypes = {
  arrayMutators: PropTypes.any,
  dndClasses: PropTypes.array.isRequired,
  getArmor: PropTypes.func.isRequired,
  initialValues: PropTypes.object,
  onFormSubmit: PropTypes.func.isRequired,
  races: PropTypes.array.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  validated: PropTypes.bool,
  validateForm: PropTypes.func,
};

export default CharacterForm;