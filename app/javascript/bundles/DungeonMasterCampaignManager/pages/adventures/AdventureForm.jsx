/**
 * Created by jesshendricks on 9/22/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Form as FinalForm} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import FormField from '../../components/forms/FormField';
import FormTextArea from '../../components/forms/FormTextArea';
import classes from '../characters/partials/character-form.module.scss';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import FormSelect from '../../components/forms/FormSelect';
import Col from 'react-bootstrap/Col';
import {FieldArray} from 'react-final-form-arrays';
import EncounterFields from '../campaigns/partials/EncounterFields';

const setAdventureObject = (values, campaignID) => {
  let adventureWorldLocationAttributes = {
    worldLocationAttributes: {
      name: 'Add adventure location...',
      description: 'New World Location...',
      mapX: 0,
      mapY: 0,
      campaignId: campaignID,
    },
  };
  if (values.worldLocation && values.worldLocation.__isNew__) {
    adventureWorldLocationAttributes = {
      worldLocationAttributes: {
        name: values.worldLocation.value,
        description: 'New World Location...',
        mapX: 0,
        mapY: 0,
        campaignId: campaignID,
      },
    };
  } else if (values.worldLocation) {
    adventureWorldLocationAttributes = {
      worldLocationId: values.worldLocation.value,
    };
    if (values.worldLocation.data && values.worldLocation.data.adventureLocationId) {
      adventureWorldLocationAttributes.id = values.worldLocation.data.adventureLocationId;
    }
  }

  const characterIds = values.playerCharacters.map((pc) => pc.value).concat(values.nonPlayerCharacters.map((npc) => npc.value));

  return {
    adventuresAttributes: [{
      id: values.id,
      name: values.name,
      description: values.description,
      characterIds,
      encountersAttributes: values.encounters.map((encounter) => {
        const encounterFields = {
          copperPieces: encounter.copperPieces,
          description: encounter.description,
          electrumPieces: encounter.electrumPieces,
          goldPieces: encounter.goldPieces,
          name: encounter.name,
          platinumPieces: encounter.platinumPieces,
          silverPieces: encounter.silverPieces,
          xp: encounter.xp,
          encounterMonstersAttributes: encounter.encounterMonsters.map((encounterMonster) => {
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
          encounterItemsAttributes: encounter.encounterItems.map((item) => {
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
        if (encounter.id) {
          encounterFields.id = encounter.id;
        }
        if (encounter._destroy) {
          encounterFields._destroy = encounter._destroy;
        }
        return encounterFields;
      }),
      adventureWorldLocationAttributes,
    }],
  };
};

class AdventureForm extends React.Component {
  state = {
    adventure: null,
    submitButtonTitle: 'Add',
    validated: false,
    worldLocationOptions: [],
  };

  componentDidMount () {
    const initialValues = {
      name: '',
      description: '',
      playerCharacters: [],
      nonPlayerCharacters: [],
      encounters: [],
    };
    if (this.props.adventure) {
      const adventure = this.props.adventure;
      initialValues.id = adventure.id;
      initialValues.name = adventure.name;
      initialValues.description = adventure.description;
      const playerCharacterOptions = adventure.pcs.map((pc) => ({value: pc.id, label: pc.name}));
      const nonPlayerCharacterOptions = adventure.npcs.map((npc) => ({value: npc.id, label: npc.name}));
      initialValues.playerCharacters = playerCharacterOptions;
      initialValues.nonPlayerCharacters = nonPlayerCharacterOptions;
      initialValues.worldLocation = adventure.worldLocation;
      initialValues.encounters = adventure.encounters ? adventure.encounters : [];
    }
    this.setState({
      adventure: initialValues,
      submitButtonTitle: this.props.adventure ? 'Save' : 'Add',
      worldLocationOptions: this.props.campaign.worldLocations.map((location) => ({
        value: location.id,
        label: location.name,
        data: {
          adventureLocationId: null,
        },
      })),
    });
  }

  handleSubmit = async (values) => {
    const campaignBody = setAdventureObject(values, this.props.campaign.id);
    this.props.onUpdateCampaign(campaignBody);
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Campaign name is required';
    }
    if (!values.worldLocation) {
      errors.worldLocation = 'World Location is required';
    }
    return errors;
  };

  render () {
    const {adventure, submitButtonTitle, validated, worldLocationOptions} = this.state;
    const {campaign, onCancelEditing} = this.props;
    const nonPlayerCharacterOptions = campaign.npcs.map((pc) => ({value: pc.id, label: pc.name}));
    const playerCharacterOptions = campaign.pcs.map((pc) => ({value: pc.id, label: pc.name}));

    return (
      <FinalForm onSubmit={this.handleSubmit}
                 initialValues={adventure}
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
                       <FormField label={'Adventure name'}
                                  type={'text'}
                                  colWidth={'12'}
                                  name={'name'}/>
                     </Form.Row>
                     <Form.Row>
                       <FormTextArea label={'Description'} colWidth={'12'} name={'description'}/>
                     </Form.Row>
                     <Form.Row>
                       <FormSelect
                         label={'World Location (required)'}
                         name={'worldLocation'}
                         colWidth={'12'}
                         options={worldLocationOptions}
                         isClearable
                         isCreateable
                       />
                     </Form.Row>
                     <Form.Row>
                       <FormSelect
                         label={'Player Characters'}
                         name={'playerCharacters'}
                         colWidth={'6'}
                         options={playerCharacterOptions}
                         isClearable
                         isMulti
                       />
                       <FormSelect
                         label={'Non-player Characters'}
                         name={'nonPlayerCharacters'}
                         colWidth={'6'}
                         options={nonPlayerCharacterOptions}
                         isClearable
                         isMulti
                       />
                     </Form.Row>
                     <Form.Row>
                       <Col md={12}>
                         <h3>Encounters</h3>
                         <FieldArray name="encounters">
                           {({fields}) => (
                             fields.map((encounter, index) => (
                               !fields.value[index] || !fields.value[index]._destroy ? (
                                 <EncounterFields encounter={encounter}
                                                  fields={fields}
                                                  index={index}
                                                  key={index}/>
                               ) : null))
                           )}
                         </FieldArray>
                         <Button type="button" onClick={() => push('encounters', {
                           name: '',
                           description: '',
                           encounterMonsters: [],
                           encounterItems: [],
                         })} variant={'success'} block>Add Encounter</Button>
                       </Col>
                     </Form.Row>
                     <Form.Row className={'my-4'}>
                       <ButtonGroup aria-label="Campaign actions">
                         <Button type="button" onClick={onCancelEditing} variant={'info'}>Cancel</Button>
                         <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'secondary'}>Reset</Button>
                         <Button type="submit" disabled={!dirty || submitting || invalid}>{submitButtonTitle}</Button>
                       </ButtonGroup>
                     </Form.Row>
                     <pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>
                   </Form>
                 )} />
    );
  }
}

AdventureForm.propTypes = {
  adventure: PropTypes.object,
  campaign: PropTypes.object.isRequired,
  onUpdateCampaign: PropTypes.func.isRequired,
  onCancelEditing: PropTypes.func.isRequired,
};

export default AdventureForm;