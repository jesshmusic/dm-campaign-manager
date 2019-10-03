/**
 * Created by jesshendricks on 9/22/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Form as FinalForm} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import EncounterFields from './EncounterFields';
import rest from '../../../actions/api';
import {connect} from 'react-redux';
import snakecaseKeys from 'snakecase-keys';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import classes from '../../characters/partials/character-form.module.scss';

const setEncounterObject = (values) => {
  const encounterFields = {
    copperPieces: values.copperPieces,
    description: values.description,
    electrumPieces: values.electrumPieces,
    goldPieces: values.goldPieces,
    location: values.location,
    name: values.name,
    platinumPieces: values.platinumPieces,
    silverPieces: values.silverPieces,
    characterIds: values.npcs ? values.npcs.map((npc) => npc.value) : [],
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
  return snakecaseKeys(encounterFields, {exclude: ['_destroy']});
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
      location: '',
      name: '',
      platinumPieces: 0,
      silverPieces: 0,
      encounterMonsters: [],
      encounterItems: [],
      npcs: [],
    };
    if (this.props.encounter) {
      const encounter = this.props.encounter;
      initialValues.id = encounter.id;
      initialValues.name = encounter.name;
      initialValues.location = encounter.location;
      initialValues.description = encounter.description;
      initialValues.copperPieces = encounter.copperPieces;
      initialValues.silverPieces = encounter.silverPieces;
      initialValues.electrumPieces = encounter.electrumPieces;
      initialValues.goldPieces = encounter.goldPieces;
      initialValues.platinumPieces = encounter.platinumPieces;
      initialValues.encounterItems = encounter.encounterItems;
      initialValues.encounterMonsters = encounter.encounterMonsters;
      initialValues.npcs = encounter.npcs.map((npc) => ({
        value: npc.id,
        label: `${npc.name} -- ${npc.classes}`,
      }));
    }
    this.setState({
      encounter: initialValues,
      submitButtonTitle: this.props.encounter ? 'Save' : 'Add',
    });
  }

  handleSubmit = async (values) => {
    const encounterBody = setEncounterObject(values);
    if (this.props.encounter) {
      this.props.updateEncounter(
        encounterBody,
        this.props.campaign.slug,
        this.props.adventure.id,
        this.props.encounter.id);
    } else {
      this.props.createEncounter(
        encounterBody,
        this.props.campaign.slug,
        this.props.adventure.id);
    }
    if (this.props.onCancelEditing) {
      this.props.onCancelEditing();
    }
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
    const {adventure, onCancelEditing, onDelete} = this.props;
    const npcOptions = adventure.npcs.map((npc) => ({
      value: npc.id,
      label: `${npc.name} -- ${npc.classes} -- ${npc.role}`,
    }));

    return (
      <FinalForm
        onSubmit={this.handleSubmit}
        initialValues={encounter}
        validate={this.validate}
        mutators={{...arrayMutators }}
        render={({
          form,
          form: {
            mutators: { push },
          },
          handleSubmit,
          pristine,
          submitting,
          values,
        }) => (
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <EncounterFields encounterFieldName={''}
                             npcOptions={npcOptions}
                             push={push}/>
            <ButtonToolbar className={'justify-content-between my-4'}>
              <ButtonGroup aria-label="Encounter delete">
                {onDelete ? (
                  <Button type="button" variant={'danger'} onClick={onDelete}>Delete Encounter</Button>
                ) : null}
              </ButtonGroup>
              <ButtonGroup aria-label="Encounter actions">
                {onCancelEditing ? (
                  <Button type="button" onClick={onCancelEditing} variant={'info'}>Cancel</Button>
                ) : null}
                <Button type="button"
                        onClick={form.reset}
                        disabled={submitting || pristine}
                        variant={'secondary'}>Reset</Button>
                <Button type="submit" disabled={submitting} variant={'success'}>{submitButtonTitle}</Button>
              </ButtonGroup>
            </ButtonToolbar>
            <pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>
          </Form>
        )} />
    );
  }
}

EncounterForm.propTypes = {
  adventure: PropTypes.object.isRequired,
  encounter: PropTypes.object,
  campaign: PropTypes.object.isRequired,
  createEncounter: PropTypes.func.isRequired,
  updateEncounter: PropTypes.func.isRequired,
  onCancelEditing: PropTypes.func,
  onDelete: PropTypes.func,
  showing: PropTypes.bool,
};

function mapStateToProps (state) {
  return {
    adventure: state.adventures.currentAdventure,
    campaign: state.campaigns.currentCampaign,
    flashMessages: state.flashMessages,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    createEncounter: (encounter, campaignSlug, adventureId) => {
      dispatch(rest.actions.createEncounter({
        campaign_slug: campaignSlug,
        adventure_id: adventureId,
      }, {body: JSON.stringify({encounter})}));
    },
    updateEncounter: (encounter, campaignId, adventureId, encounterId) => {
      dispatch(rest.actions.updateEncounter({
        campaign_slug: campaignId,
        adventure_id: adventureId,
        id: encounterId,
      }, {body: JSON.stringify({encounter})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EncounterForm);
