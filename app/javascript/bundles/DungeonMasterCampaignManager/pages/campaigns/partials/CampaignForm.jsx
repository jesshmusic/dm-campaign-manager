/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FormField from '../../../components/forms/FormField';
import FormTextArea from '../../../components/forms/FormTextArea';
import {FieldArray} from 'react-final-form-arrays';
import WorldLocationFields from './WorldLocationFields';
import Button from 'react-bootstrap/Button';
import WorldEventFields from './WorldEventFields';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {Form as FinalForm} from 'react-final-form';
import Col from 'react-bootstrap/Col';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import FormRichTextArea from '../../../components/forms/FormRichTextArea';
import classes from '../../characters/partials/character-form.module.scss';

const CampaignForm = ({arrayMutators, initialValues, onDelete, onFormSubmit, submitButtonText, validated, validateForm }) => (
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
             }) => (
               <Form noValidate validated={validated} onSubmit={handleSubmit}>
                 <Form.Row>
                   <FormField label={'Campaign name'}
                              type={'text'}
                              colWidth={'7'}
                              name={'name'}/>
                   <FormField label={'World'}
                              type={'text'}
                              colWidth={'5'}
                              name={'world'}/>
                 </Form.Row>
                 <Form.Row>
                   <FormRichTextArea label={'Description'} colWidth={'12'} name={'description'}/>
                 </Form.Row>
                 <Form.Row className={'my-4 py-4 border-top'}>
                   <Col>
                     <h2>World Locations</h2>
                     <FieldArray name="worldLocations">
                       {({ fields }) =>
                         // eslint-disable-next-line max-len
                         fields.map((world_location, index) => (!fields.value[index] || !fields.value[index]._destroy ? (
                           <WorldLocationFields location={world_location}
                                                fields={fields}
                                                index={index}
                                                key={index} />
                         ) : null))
                       }
                     </FieldArray>
                     <Button type="button" onClick={() => push('worldLocations', undefined)} variant={'info'} block>Add World Location</Button>
                   </Col>
                 </Form.Row>
                 <Form.Row className={'my-4 py-4 border-top'}>
                   <Col>
                     <h2>World Events</h2>
                     <FieldArray name="worldEvents">
                       {({ fields }) =>
                         fields.map((event, index) => (!fields.value[index] || !fields.value[index]._destroy ? (
                           <WorldEventFields event={event}
                                             fields={fields}
                                             index={index}
                                             key={index} />
                         ) : null))
                       }
                     </FieldArray>
                     <Button type="button" onClick={() => push('worldEvents', undefined)} variant={'info'} block>Add World Event</Button>
                   </Col>
                 </Form.Row>
                 <ButtonToolbar className={'justify-content-between'}>
                   <ButtonGroup aria-label="Campaign delete">
                     {onDelete ? (
                       <Button type="button" variant={'danger'} onClick={onDelete}>Delete Campaign</Button>
                     ) : null}
                   </ButtonGroup>
                   <ButtonGroup aria-label="Campaign actions">
                     <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'secondary'}>Reset</Button>
                     <Button type="submit" disabled={submitting} variant={'success'}>{submitButtonText}</Button>
                   </ButtonGroup>
                 </ButtonToolbar>
                 <pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>
               </Form>
             )} />
);

CampaignForm.propTypes = {
  arrayMutators: PropTypes.any,
  initialValues: PropTypes.object,
  onDelete: PropTypes.func,
  onFormSubmit: PropTypes.func.isRequired,
  submitButtonText: PropTypes.string.isRequired,
  validated: PropTypes.bool,
  validateForm: PropTypes.func,
};

export default CampaignForm;