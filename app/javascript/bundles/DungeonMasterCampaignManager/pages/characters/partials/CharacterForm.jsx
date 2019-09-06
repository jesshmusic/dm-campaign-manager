/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FormField from '../../../components/forms/FormField';
import FormTextArea from '../../../components/forms/FormTextArea';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {Form as FinalForm} from 'react-final-form';

import classes from './character-form.module.scss';

const FormComponent = ({validated, handleSubmit, submitting, submitButtonText, form, pristine, values}) => (
  <Form noValidate validated={validated} onSubmit={handleSubmit}>
    <Form.Row>
      <FormField label={'Character name'}
                 type={'text'}
                 colWidth={'7'}
                 name={'name'}/>
      <FormField label={'Race'}
                 type={'text'}
                 colWidth={'5'}
                 name={'race'}/>
    </Form.Row>
    <Form.Row>
      <FormTextArea label={'Description'} colWidth={'12'} name={'description'}/>
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
  pristine: PropTypes.bool,
  values: PropTypes.object,
};

const CharacterForm = ({arrayMutators, initialValues, onFormSubmit, submitButtonText, validated, validateForm }) => (
  <FinalForm onSubmit={onFormSubmit}
             initialValues={initialValues}
             validate={validateForm}
             mutators={{...arrayMutators }}
             render={({
               handleSubmit,
               form: {
                 mutators: { push, pop },
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
                                  values={values} />} />
);

CharacterForm.propTypes = {
  arrayMutators: PropTypes.any,
  initialValues: PropTypes.object,
  onFormSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  validated: PropTypes.bool,
  validateForm: PropTypes.func,
};

export default CharacterForm;