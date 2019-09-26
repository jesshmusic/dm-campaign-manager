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
  return snakecaseKeys(encounterFields);
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
    this.props.onCancelEditing();
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
      <FinalForm
        onSubmit={this.handleSubmit}
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
            <EncounterFields encounterFieldName={''} push={push}/>
            <ButtonGroup aria-label="Encounter actions">
              <Button type="button"
                      onClick={onCancelEditing}
                      variant={'info'}>Cancel</Button>
              <Button type="button"
                      onClick={form.reset}
                      disabled={submitting || pristine}
                      variant={'secondary'}>Reset</Button>
              <Button type="submit"
                      disabled={!dirty || submitting || invalid}>{submitButtonTitle}</Button>
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
  createEncounter: PropTypes.func.isRequired,
  updateEncounter: PropTypes.func.isRequired,
  onCancelEditing: PropTypes.func.isRequired,
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
