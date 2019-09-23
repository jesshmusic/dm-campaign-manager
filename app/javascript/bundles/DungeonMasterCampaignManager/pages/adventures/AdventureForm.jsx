/**
 * Created by jesshendricks on 9/22/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import {Form as FinalForm} from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import snakecaseKeys from 'snakecase-keys';
import FormField from '../../components/forms/FormField';
import FormTextArea from '../../components/forms/FormTextArea';
import classes from '../characters/partials/character-form.module.scss';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Button from 'react-bootstrap/Button';
import FormSelect from '../../components/forms/FormSelect';

class AdventureForm extends React.Component {
  state = {
    adventure: null,
    worldLocationOptions: [],
    validated: false,
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
      initialValues.id = this.props.adventure.id;
      initialValues.name = this.props.adventure.name;
      initialValues.description = this.props.adventure.description;
      initialValues.playerCharacters = this.props.adventure.characters;
      initialValues.nonPlayerCharacters = this.props.adventure.characters;
      initialValues.worldLocation = this.props.adventure.worldLocation;
      initialValues.encounters = this.props.adventure.encounters;
    }
    this.setState({
      adventure: initialValues,
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
    const campaignBody = {
      adventuresAttributes: [{
        id: values.id,
        name: values.name,
        description: values.description,
        characterIds: values.playerCharacters.map((character) => character.id),
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
            encounterItemsAttributes: values.equipmentItems.map((item) => {
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
      }],
    };
    if (values.worldLocation && values.worldLocation.__isNew__) {
      campaignBody.adventureWorldLocationAttributes = {
        worldLocationsAttributes: {
          name: values.worldLocation.value,
          description: 'New World Location...',
          mapX: 0,
          mapY: 0,
        },
      };
    } else if (values.worldLocation) {
      campaignBody.adventureWorldLocationAttributes = {
        worldLocationId: values.worldLocation.value,
      };
      if (values.worldLocation.data && values.worldLocation.data.adventureLocationId) {
        campaignBody.adventureWorldLocationAttributes.id = values.worldLocation.data.adventureLocationId;
      }
    } else {
      campaignBody.adventureWorldLocationAttributes = {
        worldLocationsAttributes: {
          name: 'Add adventure location...',
          description: 'New World Location...',
          mapX: 0,
          mapY: 0,
        },
      };
    }
    this.props.updateCampaign(snakecaseKeys(campaignBody, {exclude: ['_destroy']}), this.props.campaign.slug);
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
    const {adventure, worldLocationOptions, validated} = this.state;

    return (
      <FinalForm onSubmit={this.handleSubmit}
                 initialValues={adventure}
                 validate={this.validate}
                 mutators={{...arrayMutators }}
                 render={({
                   handleSubmit,
                   form: {
                     mutators: { push, pop },
                   },
                   invalid,
                   submitting,
                   form,
                   pristine,
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
                       <ButtonGroup aria-label="Campaign actions">
                         <Button type="submit" disabled={submitting || invalid}>Add Adventure</Button>
                         <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'secondary'}>Reset</Button>
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
  updateCampaign: PropTypes.func.isRequired,
};

function mapStateToProps (state) {
  return {};
}

function mapDispatchToProps (dispatch) {
  return {
    updateCampaign: (campaign, campaignSlug) => {
      dispatch(rest.actions.updateCampaign({slug: campaignSlug}, {body: JSON.stringify({campaign})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AdventureForm);