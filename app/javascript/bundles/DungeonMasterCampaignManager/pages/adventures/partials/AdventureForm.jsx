/**
 * Created by jesshendricks on 9/22/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Form as FinalForm} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import FormField from '../../../components/forms/FormField';
import FormRichTextArea from '../../../components/forms/FormRichTextArea';
import Button from 'react-bootstrap/Button';
import FormSelect from '../../../components/forms/FormSelect';
import Col from 'react-bootstrap/Col';
import {FieldArray} from 'react-final-form-arrays';
import EncounterFormCard from '../../encounters/partials/EncounterFormCard';
// import classes from '../../characters/partials/character-form.module.scss';
import Row from 'react-bootstrap/Row';

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

  const characterIds = values.playerCharacters.map((pc) => pc.value)
    .concat(values.nonPlayerCharacters.map((npc) => npc.value));

  return {
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
        location: encounter.location,
        platinumPieces: encounter.platinumPieces,
        silverPieces: encounter.silverPieces,
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
        encounterNpcsAttributes: encounter.encounterNpcs.map((npc) => {
          const npcFields = {
            isCombatant: npc.isCombatant,
            characterId: npc.npc.value,
          };
          if (npc.id) {
            npcFields.id = npc.id;
          }
          if (npc._destroy) {
            npcFields._destroy = npc._destroy;
          }
          return npcFields;
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
  };
};

const setupInitialValues = (adventure) => {
  const initialValues = {
    name: '',
    description: '',
    playerCharacters: [],
    nonPlayerCharacters: [],
    encounters: [],
  };

  initialValues.id = adventure.id;
  initialValues.name = adventure.name;
  initialValues.description = adventure.description;
  const playerCharacterOptions = adventure.pcs.map((pc) => ({value: pc.id, label: pc.name}));
  const nonPlayerCharacterOptions = adventure.npcs.map((npc) => ({
    value: npc.id,
    label: `${npc.name} -- ${npc.classes} -- ${npc.role}`}));
  initialValues.playerCharacters = playerCharacterOptions;
  initialValues.nonPlayerCharacters = nonPlayerCharacterOptions;
  initialValues.worldLocation = adventure.worldLocation;
  initialValues.encounters = adventure.encounters ? adventure.encounters : [];
  return initialValues;
};

class AdventureForm extends React.Component {
  state = {
    adventure: null,
    submitButtonTitle: 'Add',
    validated: false,
    worldLocationOptions: [],
  };

  componentDidMount () {
    if (this.props.adventure) {
      const adventure = this.props.adventure;
      this.setState({
        adventure: setupInitialValues(adventure),
      });
    } else {
      fetch(`/v1/campaigns/${this.props.campaign.slug}/adventures/new.json`)
        .then((response) => response.json())
        .then((adventure) => {
          this.setState({
            adventure: setupInitialValues(adventure),
          });
        });
    }
    this.setState({
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
    const adventureBody = setAdventureObject(values, this.props.campaign.id);
    this.props.onUpdateAdventure(adventureBody);
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
    const {campaign, onCancelEditing, onDelete} = this.props;
    const nonPlayerCharacterOptions = campaign.npcs.map((pc) => ({value: pc.id, label: pc.name}));
    const playerCharacterOptions = campaign.pcs.map((pc) => ({value: pc.id, label: pc.name}));
    const adventureNpcOptions = adventure ? adventure.nonPlayerCharacters : [];

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
                     <Row>
                       <Col xs={{span: 12, order: 2}} sm={{span: 10, order: 1}}>
                         <Form.Row>
                           <FormField label={'Adventure name'}
                                      type={'text'}
                                      colWidth={'12'}
                                      name={'name'}/>
                         </Form.Row>
                         <Form.Row>
                           <FormRichTextArea label={'Description'} colWidth={'12'} name={'description'}/>
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
                                 fields.map((encounterFieldName, index) => (
                                   !fields.value[index] || !fields.value[index]._destroy ? (
                                     <EncounterFormCard encounterFieldName={encounterFieldName}
                                                        fields={fields}
                                                        index={index}
                                                        key={index}
                                                        npcOptions={adventureNpcOptions}
                                                        push={push}/>
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
                       </Col>
                       <Col xs={{span: 12, order: 1}} sm={{span: 2, order: 2}}>
                         <div className={'sticky-top pt-3'}>
                           <Button type="submit" disabled={submitting} variant={'success'} block>{submitButtonTitle}</Button>
                           <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'link'}>Reset Form</Button>
                           {onCancelEditing ? (
                             <Button type="button" onClick={onCancelEditing} variant={'info'}>Cancel</Button>
                           ) : null}
                           {onDelete ? (
                             <Button type="button" variant={'link'} onClick={onDelete}>Delete Adventure</Button>
                           ) : null}
                         </div>
                       </Col>
                     </Row>
                     {/*<pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>*/}
                   </Form>
                 )} />
    );
  }
}

AdventureForm.propTypes = {
  adventure: PropTypes.object,
  campaign: PropTypes.object.isRequired,
  onDelete: PropTypes.func,
  onUpdateAdventure: PropTypes.func.isRequired,
  onCancelEditing: PropTypes.func,
};

export default AdventureForm;