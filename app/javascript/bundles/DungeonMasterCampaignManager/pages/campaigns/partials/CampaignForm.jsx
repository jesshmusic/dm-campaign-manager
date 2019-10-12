/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import {Form as FinalForm} from 'react-final-form';
import Col from 'react-bootstrap/Col';
// import classes from '../../characters/partials/character-form.module.scss';
import Row from 'react-bootstrap/Row';
import CampaignFields from './CampaignFields';

const CampaignForm = ({arrayMutators, initialValues, onDelete, onFormSubmit, validated, validateForm }) => (
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
                 <Row>
                   <Col sm={{span: 12, order: 2}} md={{span: 10, order: 1}}>
                     <CampaignFields push={push}/>
                   </Col>
                   <Col sm={{span: 12, order: 1}} md={{span: 2, order: 2}} className={'pl-md-0'}>
                     <div className={'sticky-top py-3'}>
                       <Button type="submit" disabled={submitting || pristine} variant={'success'} block>
                         Save
                       </Button>
                       <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'link'} block>
                         Reset Form
                       </Button>
                       {onDelete ? (
                         <Button type="button" variant={'link'} onClick={onDelete} block>
                           Delete Campaign
                         </Button>
                       ) : null}
                     </div>
                   </Col>
                 </Row>
                 {/* <pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>*/}
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