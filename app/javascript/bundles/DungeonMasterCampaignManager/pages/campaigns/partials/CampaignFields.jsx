/**
 * Created by jesshendricks on 10/12/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FormField from '../../../components/forms/FormField';
import FormRichTextArea from '../../../components/forms/FormRichTextArea';
import FormSelect from '../../../components/forms/FormSelect';
import Col from 'react-bootstrap/Col';
import {FieldArray} from 'react-final-form-arrays';
import EncounterFormCard from '../../encounters/partials/EncounterFormCard';
import Button from 'react-bootstrap/Button';
import WorldLocationFields from './WorldLocationFields';
import WorldEventFields from './WorldEventFields';

const CampaignFields = ({ push }) => {
  return (
    <div>
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
    </div>
  );
};

CampaignFields.propTypes = {
  push: PropTypes.func.isRequired,
};

export default CampaignFields;