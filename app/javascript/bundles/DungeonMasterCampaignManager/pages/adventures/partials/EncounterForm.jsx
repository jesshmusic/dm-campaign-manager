/**
 * Created by jesshendricks on 9/22/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Form as FinalForm} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import FormField from '../../../components/forms/FormField';
import FormTextArea from '../../../components/forms/FormTextArea';
import classes from '../../characters/partials/character-form.module.scss';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import {FieldArray} from 'react-final-form-arrays';
import EncounterMonsterFields from './EncounterMonsterFields';
import EncounterItemFields from './EncounterItemFields';

const setEncounterObject = (values, campaignId, adventureId) => {
  const encounterFields = {
    copperPieces: values.copperPieces,
    description: values.description,
    electrumPieces: values.electrumPieces,
    goldPieces: values.goldPieces,
    name: values.name,
    platinumPieces: values.platinumPieces,
    silverPieces: values.silverPieces,
    encounterMonstersAttributes: values.encounterMonsters.map((encounterMonster) => {
      const newMonsters = {
        numberOfMonsters: encounterMonster.numberOfMonsters,
        monsterId: encounterMonster.monster.value,
      };
      if (encounterMonster.id) {
        newMonsters.id = encounterMonster.id;
      }
      if (encounterMonster._destroy) {
        newMonsters._destroy = encounterMonster._destroy;
      }
      return newMonsters;
    }),
    encounterItemsAttributes: values.encounterItems.map((item) => {
      const itemFields = {
        quantity: item.quantity,
        itemId: item.item.value,
      };
      if (item.id) {
        itemFields.id = item.id;
      }
      if (item._destroy) {
        itemFields._destroy = item._destroy;
      }
      return itemFields;
    }),
  };
  if (values.id) {
    encounterFields.id = values.id;
  }
  if (values._destroy) {
    encounterFields._destroy = values._destroy;
  }
  return {
    id: campaignId,
    adventuresAttributes: [{
      id: adventureId,
      encountersAttributes: [ encounterFields ],
    }],
  };
};

class EncounterForm extends React.Component {
  state = {
    encounter: null,
    submitButtonTitle: 'Add',
    validated: false,
  };

  componentDidMount () {
    const initialValues = {
      copperPieces: 0,
      description: '',
      electrumPieces: 0,
      goldPieces: 0,
      name: '',
      platinumPieces: 0,
      silverPieces: 0,
      encounterMonsters: [],
      encounterItems: [],
    };
    if (this.props.encounter) {
      const encounter = this.props.encounter;
      initialValues.id = encounter.id;
      initialValues.name = encounter.name;
      initialValues.description = encounter.description;
      initialValues.copperPieces = encounter.copperPieces;
      initialValues.silverPieces = encounter.silverPieces;
      initialValues.electrumPieces = encounter.electrumPieces;
      initialValues.goldPieces = encounter.goldPieces;
      initialValues.platinumPieces = encounter.platinumPieces;
      initialValues.encounterItems = encounter.encounterItems;
      initialValues.encounterMonsters = encounter.encounterMonsters;
    }
    this.setState({
      encounter: initialValues,
      submitButtonTitle: this.props.encounter ? 'Save' : 'Add',
    });
  }

  handleSubmit = async (values) => {
    const campaignBody = setEncounterObject(values, this.props.campaign.id, this.props.adventure.id);
    this.props.onUpdateCampaign(campaignBody);
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Campaign name is required';
    }
    if (!values.description) {
      errors.description = 'Description is required';
    }
    return errors;
  };

  render () {
    const {encounter, submitButtonTitle, validated} = this.state;
    const {onCancelEditing} = this.props;

    return (
      <FinalForm onSubmit={this.handleSubmit}
                 initialValues={encounter}
                 validate={this.validate}
                 mutators={{...arrayMutators }}
                 render={({
                   dirty,
                   form,
                   form: {
                     mutators: { push, pop },
                   },
                   handleSubmit,
                   invalid,
                   pristine,
                   submitting,
                   values,
                 }) => (
                   <Form noValidate validated={validated} onSubmit={handleSubmit}>
                     <Form.Row>
                       <FormField label={'Name'}
                                  type={'text'}
                                  colWidth={'12'}
                                  name={'name'}/>
                     </Form.Row>
                     <Form.Row>
                       <FormTextArea label={'Description'}
                                     colWidth={'12'}
                                     name={'description'}/>
                     </Form.Row>
                     <h4>Treasure</h4>
                     <Form.Row>
                       <FormField label={'Copper'} type={'number'} colWidth={'2'} name={'copperPieces'}/>
                       <FormField label={'Silver'} type={'number'} colWidth={'2'} name={'silverPieces'}/>
                       <FormField label={'Electrum'} type={'number'} colWidth={'2'} name={'electrumPieces'}/>
                       <FormField label={'Gold'} type={'number'} colWidth={'2'} name={'goldPieces'}/>
                       <FormField label={'Platinum'} type={'number'} colWidth={'2'} name={'platinumPieces'}/>
                     </Form.Row>
                     <Form.Row>
                       <Col md={12}>
                         <h4>Monsters</h4>
                         <FieldArray name={'encounterMonsters'}>
                           {({fields}) => (
                             fields.map((monster, index) => (
                               !fields.value[index] || !fields.value[index]._destroy ? (
                                 <EncounterMonsterFields encounterMonster={monster}
                                                         fields={fields}
                                                         index={index}
                                                         key={index}/>
                               ) : null))
                           )}
                         </FieldArray>
                         <Button type="button" onClick={() => push('encounterMonsters', {
                           numberOfMonsters: 1,
                         })} variant={'link'} block>Add Monster...</Button>
                       </Col>
                     </Form.Row>
                     <Form.Row>
                       <Col md={12}>
                         <h4>Items/Treasure/Equipment</h4>
                         <FieldArray name={'encounterItems'}>
                           {({fields}) => (
                             fields.map((encounterItem, index) => (
                               !fields.value[index] || !fields.value[index]._destroy ? (
                                 <EncounterItemFields encounterItem={encounterItem}
                                                      fields={fields}
                                                      index={index}
                                                      key={index}/>
                               ) : null))
                           )}
                         </FieldArray>
                         <Button type="button" onClick={() => push('encounterItems', {
                           quantity: 1,
                         })} variant={'link'} block>Add Item...</Button>
                       </Col>
                     </Form.Row>
                     <ButtonGroup aria-label="Encounter actions">
                       <Button type="button" onClick={onCancelEditing} variant={'info'}>Cancel</Button>
                       <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'secondary'}>Reset</Button>
                       <Button type="submit" disabled={!dirty || submitting || invalid}>{submitButtonTitle}</Button>
                     </ButtonGroup>
                   </Form>
                 )} />
    );
  }
}

EncounterForm.propTypes = {
  adventure: PropTypes.object,
  encounter: PropTypes.object,
  campaign: PropTypes.object.isRequired,
  onUpdateCampaign: PropTypes.func.isRequired,
  onCancelEditing: PropTypes.func.isRequired,
  showing: PropTypes.bool,
};

export default EncounterForm;

// A large steel door, which is in surprisingly good shape, blocks the way into the catacombs. It is locked with a relatively easily picked lock (DC 10). If no one can pick the lock, it can be opened with an athletics check at DC 15.
// If the door is broken down, the skeletons on the other side will have surprise. If it is picked the party can make perception checks at DC 15 to see if they hear the skeletons stirring.