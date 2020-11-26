/**
 * Created by jesshendricks on 9/22/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import {Form as FinalForm} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import EncounterFields from './EncounterFields';
import rest from '../../../actions/api';
import {connect} from 'react-redux';
import snakecaseKeys from 'snakecase-keys';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
// import classes from '../../characters/partials/character-form.module.scss';

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
    sort: values.sort,
    encounterNPCsAttributes: values.encounterNPCs.reduce((result, encounterNPC) => {
      if (encounterNPC.monster) {
        const newNPCs = {
          numberOfNPCs: encounterNPC.numberOfNPCs,
          monsterId: encounterNPC.monster.value,
        };
        if (encounterNPC.id) {
          newNPCs.id = encounterNPC.id;
        }
        if (encounterNPC._destroy) {
          newNPCs._destroy = encounterNPC._destroy;
        }
        result.push(newNPCs);
      }
      return result;
    }, []),
    encounterItemsAttributes: values.encounterItems.reduce((result, item) => {
      if (item.item) {
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
        result.push(itemFields);
      }
      return result;
    }, []),
    encounterNpcsAttributes: values.encounterNpcs.reduce((result, npc) => {
      if (npc.npc) {
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
        result.push(npcFields);
      }
      return result;
    }, []),
  };
  if (values.id) {
    encounterFields.id = values.id;
  }
  return snakecaseKeys(encounterFields, {exclude: ['_destroy']});
};

const setupInitialValues = (encounter, newEncounterSort = 0) => {
  const initialValues = {
    copperPieces: 0,
    description: '',
    electrumPieces: 0,
    goldPieces: 0,
    location: '',
    name: '',
    platinumPieces: 0,
    silverPieces: 0,
    sort: newEncounterSort,
    encounterNPCs: [],
    encounterItems: [],
    encounterNpcs: [],
  };
  if (encounter) {
    initialValues.id = encounter.id;
    initialValues.name = encounter.name;
    initialValues.location = encounter.location;
    initialValues.description = encounter.description;
    initialValues.copperPieces = encounter.copperPieces;
    initialValues.silverPieces = encounter.silverPieces;
    initialValues.electrumPieces = encounter.electrumPieces;
    initialValues.goldPieces = encounter.goldPieces;
    initialValues.platinumPieces = encounter.platinumPieces;
    initialValues.sort = encounter.sort;
    initialValues.encounterItems = encounter.encounterItems;
    initialValues.encounterNPCs = encounter.encounterNPCs;
    initialValues.encounterNpcs = encounter.encounterNpcs;
  }
  return initialValues;
};

class EncounterForm extends React.Component {
  state = {
    encounter: null,
    validated: false,
  };

  componentDidMount () {
    this.setState({
      encounter: setupInitialValues(this.props.encounter, this.props.newEncounterSort),
    });
  }

  componentDidUpdate (prevProps) {
    if (prevProps.encounter !== this.props.encounter ) {
      this.setState({encounter: setupInitialValues(this.props.encounter, this.props.newEncounterSort)});
    }
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
    const {encounter, validated} = this.state;
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
            <Row>
              <Col sm={{span: 12, order: 2}} md={{span: 10, order: 1}}>
                <EncounterFields encounterFieldName={''}
                                 npcOptions={npcOptions}
                                 push={push}/>
              </Col>
              <Col sm={{span: 12, order: 1}} md={{span: 2, order: 2}} className={'pl-md-0'}>
                <div className={'sticky-top py-3'}>
                  <Button type="submit" disabled={submitting || pristine} variant={'success'} block>
                    Save
                  </Button>
                  <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'link'} block>
                    Reset Form
                  </Button>
                  {onCancelEditing ? (
                    <Button type="button" onClick={onCancelEditing} variant={'link'} block>
                      Cancel
                    </Button>
                  ) : null}
                  {onDelete ? (
                    <Button type="button" variant={'link'} onClick={onDelete} block>
                      Delete Encounter
                    </Button>
                  ) : null}
                </div>
              </Col>
            </Row>
            {/* <pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>*/}
          </Form>
        )} />
    );
  }
}

EncounterForm.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  createEncounter: PropTypes.func.isRequired,
  encounter: PropTypes.object,
  newEncounterSort: PropTypes.number,
  onCancelEditing: PropTypes.func,
  onDelete: PropTypes.func,
  showing: PropTypes.bool,
  updateEncounter: PropTypes.func.isRequired,
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
      }, {
        body: JSON.stringify({encounter}),
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EncounterForm);
