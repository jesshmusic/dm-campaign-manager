/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import { connect } from 'react-redux';

import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import {FieldArray} from 'react-final-form-arrays';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';

import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import FormField from '../../components/forms/FormField';
import FormSelect from '../../components/forms/FormSelect';
import FormTextArea from '../../components/forms/FormTextArea';
import CharacterClassFields from './partials/CharacterClassFields';

import classes from './partials/character-form.module.scss';

import { alignmentOptions, SetupCharacterState, characterCalculations } from '../../utilities/character-utilities';

const filterOptions = (results) => results.map((nextItem) => (
  {value: nextItem.id, label: nextItem.name, data: nextItem}
));

class PlayerCharacterEditor extends React.Component {
  state = {
    editingPlayerCharacter: null,
    raceOptions: [],
    classOptions: [],
    validated: false,
    armors: [],
    weapons: [],
    items: [],
    shields: [],
    armorOptions: [],
    shieldOptions: [],
    weaponOptions: [],
    weaponTwoHandedOptions: [],
  };

  componentDidMount () {
    this.props.getItems();
    this.props.getDndClasses();
    this.props.getRaces();
    if (this.props.pcSlug) {
      this.props.getPlayerCharacter(this.props.campaignSlug, this.props.pcSlug);
    } else {
      this.props.editingPlayerCharacter(this.props.campaignSlug);
    }
  }

  componentDidUpdate (prevProps) {
    if (prevProps.currentPlayerCharacter !== this.props.currentPlayerCharacter ) {
      this.setState({ editingPlayerCharacter: SetupCharacterState(
        this.props.currentPlayerCharacter,
        this.props.races) });
    }

    if (prevProps.races !== this.props.races) {
      this.setState({
        raceOptions: filterOptions(this.props.races),
      });
    }

    if (prevProps.dndClasses !== this.props.dndClasses) {
      this.setState({ classOptions: filterOptions(this.props.dndClasses) });
    }

    if (prevProps.items !== this.props.items) {
      this.setState({
        armor: this.props.items.filter((item) => item.type === 'ArmorItem' && item.subCategory !== 'Shield'),
        armorOptions: filterOptions(
          this.props.items.filter((item) => item.type === 'ArmorItem' && item.subCategory !== 'Shield')
        ),
        shields: this.props.items.filter((item) => item.type === 'ArmorItem' && item.subCategory === 'Shield'),
        shieldOptions: filterOptions(
          this.props.items.filter((item) => item.type === 'ArmorItem' && item.subCategory === 'Shield')
        ),
        weaponOptions: filterOptions(
          this.props.items.filter((item) => item.type === 'WeaponItem' &&
              (!item.weaponProperties || !item.weaponProperties.includes('Two-Handed')))
        ),
        weaponTwoHandedOptions: filterOptions(
          this.props.items.filter((item) => item.type === 'WeaponItem' &&
              (item.weapon2hDamageType || (item.weaponProperties && item.weaponProperties.includes('Two-Handed'))))
        ),
        weapons: this.props.items.filter((item) => item.type === 'WeaponItem'),
      });
    }
  }

  handleSubmit = async (values) => {
    const newChar = {
      name: values.name,
      alignment: values.characterAlignment.value,
      description: values.description,
      race_id: values.characterRace.value,
      character_classes_attributes: values.dndClasses.map((dndClass) => {
        const returnClass = {
          level: dndClass.level,
          dnd_class_id: dndClass.dndClass.value,
        };
        if (dndClass.id) {
          returnClass.id = dndClass.id;
        }
        return returnClass;
      }),
    };
    console.log(newChar);
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Character name is required';
    }
    return errors;
  };

  render () {
    const { flashMessages, user } = this.props;
    const {
      armorOptions,
      classOptions,
      editingPlayerCharacter,
      raceOptions,
      shieldOptions,
      weaponOptions,
      weaponTwoHandedOptions,
      validated } = this.state;
    const currentCampaign = editingPlayerCharacter && editingPlayerCharacter.campaign ? `Campaign: ${editingPlayerCharacter.campaign.name}` : 'Campaign';
    const pageTitle = this.props.pcSlug ? `Edit Player Character "${editingPlayerCharacter ? editingPlayerCharacter.name : 'Loading...'}"` : 'New Player Character';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={pageTitle}
                     description={'New Player Character form. Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${this.props.campaignSlug}`, isActive: false, title: currentCampaign},
                       {url: null, isActive: true, title: pageTitle},
                     ]}>
        <PageTitle title={pageTitle}/>
        {editingPlayerCharacter ? (
          <FinalForm onSubmit={this.handleSubmit}
                     initialValues={editingPlayerCharacter}
                     validate={this.validate}
                     decorators={[characterCalculations]}
                     mutators={{...arrayMutators }}
                     render={({
                       handleSubmit,
                       form: {
                         mutators: { push },
                       },
                       submitting,
                       form,
                       pristine,
                       values,
                     }) => (
                       <Form noValidate validated={validated} onSubmit={handleSubmit}>
                         <Form.Row>
                           <FormField label={'Character name'} type={'text'} colWidth={'3'} name={'name'}/>
                           <FormSelect label={'Alignment'} colWidth={'3'} name={'characterAlignment'} options={alignmentOptions}/>
                           <FormSelect label={'Race'} colWidth={'3'} name={'characterRace'} options={raceOptions}/>
                           <FormField label={'Background'} type={'text'} colWidth={'3'} name={'background'}/>
                         </Form.Row>
                         <Form.Row>
                           <FormTextArea label={'Description'} colWidth={'7'} name={'description'}/>
                           <FormField label={'Languages'} type={'text'} colWidth={'5'} name={'languages'}/>
                         </Form.Row>
                         <h2>Classes</h2>
                         <Form.Row>
                           <Col md={6}>
                             <FieldArray name="dndClasses">
                               {({ fields }) =>
                                 fields.map((characterClass, index) => (
                                   !fields.value[index] || !fields.value[index]._destroy ? (
                                     <CharacterClassFields characterClass={characterClass}
                                                           fields={fields}
                                                           index={index}
                                                           key={index}
                                                           classOptions={classOptions}/>
                                   ) : null))
                               }
                             </FieldArray>
                             <Button type="button" onClick={() => push('dndClasses', {
                               dndClass: {
                                 value: 153,
                                 label: 'Fighter',
                               },
                               level: 1,
                             })} variant={'info'} block>Add Class</Button>
                           </Col>
                         </Form.Row>
                         <h2>Statistics</h2>
                         <Form.Row>
                           <FormField label={'Armor Class'} type={'number'} colWidth={'2'} name={'armorClass'} readOnly />
                           <FormField label={'AC Mod'}
                                      type={'number'}
                                      colWidth={'2'}
                                      name={'armorClassModifier'}
                                      infoText={'Magic item or special ability'}
                           />
                           <FormField label={'Hit Points'} type={'number'} colWidth={'4'} name={'hitPoints'}/>
                           <FormField label={'Experience Points'} type={'number'} colWidth={'4'} name={'xp'}/>
                         </Form.Row>
                         <h2>Ability Scores</h2>
                         <Form.Row>
                           <FormField label={'Use Race Modifiers'}
                                      name={'applyRaceMods'}
                                      colWidth={'12'}
                                      type={'checkbox'}
                                      infoText={'Add racial bonuses to ability scores.'}
                           />
                         </Form.Row>
                         <Form.Row>
                           <FormField label={'STR'} type={'number'} colWidth={'2'} name={'strength'}/>
                           <FormField label={'DEX'} type={'number'} colWidth={'2'} name={'dexterity'}/>
                           <FormField label={'CON'} type={'number'} colWidth={'2'} name={'constitution'}/>
                           <FormField label={'INT'} type={'number'} colWidth={'2'} name={'intelligence'}/>
                           <FormField label={'WIS'} type={'number'} colWidth={'2'} name={'wisdom'}/>
                           <FormField label={'CHA'} type={'number'} colWidth={'2'} name={'charisma'}/>
                         </Form.Row>
                         <h2>Coin</h2>
                         <Form.Row>
                           <FormField label={'Copper'} type={'number'} colWidth={'2'} name={'copperPieces'}/>
                           <FormField label={'Silver'} type={'number'} colWidth={'2'} name={'silverPieces'}/>
                           <FormField label={'Electrum'} type={'number'} colWidth={'2'} name={'electrumPieces'}/>
                           <FormField label={'Gold'} type={'number'} colWidth={'2'} name={'goldPieces'}/>
                           <FormField label={'Platinum'} type={'number'} colWidth={'2'} name={'platinumPieces'}/>
                         </Form.Row>
                         <h2>Equipment</h2>
                         <h3>Armor and Weapons</h3>
                         <Form.Row>
                           <FormSelect label={'Armor'} colWidth={'6'} name={'characterArmor'} options={armorOptions} isClearable/>
                           <FormSelect label={'Shield'} colWidth={'6'} name={'characterShield'} options={shieldOptions} isClearable/>
                           <FormSelect label={'Weapon - Left hand'} colWidth={'4'} name={'characterWeaponLH'} options={weaponOptions} isClearable/>
                           <FormSelect label={'Weapon - Right hand'} colWidth={'4'} name={'characterWeaponRH'} options={weaponOptions} isClearable/>
                           <FormSelect label={'Weapon - two-hand'} colWidth={'4'} name={'characterWeapon2H'} options={weaponTwoHandedOptions} isClearable/>
                         </Form.Row>
                         <Form.Row>
                           <ButtonGroup aria-label="Character actions">
                             <Button type="submit" disabled={submitting}>Save</Button>
                             <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'secondary'}>Reset</Button>
                           </ButtonGroup>
                         </Form.Row>
                         <pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>
                       </Form>
                     )}
          />) : <Spinner/>}
      </PageContainer>
    );
  }
}

PlayerCharacterEditor.propTypes = {
  campaignSlug: PropTypes.string,
  createPlayerCharacter: PropTypes.func.isRequired,
  currentPlayerCharacter: PropTypes.object,
  dndClasses: PropTypes.array,
  editingPlayerCharacter: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getDndClasses: PropTypes.func.isRequired,
  getItems: PropTypes.func.isRequired,
  getPlayerCharacter: PropTypes.func.isRequired,
  getRaces: PropTypes.func.isRequired,
  items: PropTypes.array,
  pcSlug: PropTypes.string,
  races: PropTypes.array,
  updatePlayerCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    dndClasses: state.dndClasses.dndClasses,
    flashMessages: state.flashMessages,
    currentPlayerCharacter: state.playerCharacters.currentCharacter,
    items: state.items.items,
    races: state.races.races,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getItems: () => {
      dispatch(rest.actions.getItems());
    },
    getDndClasses: () => {
      dispatch(rest.actions.getDndClasses());
    },
    getPlayerCharacter: (campaignSlug, characterSlug) => {
      dispatch(rest.actions.getPlayerCharacter({campaign_slug: campaignSlug, slug: characterSlug}));
    },
    editingPlayerCharacter: (campaignSlug) => {
      dispatch(rest.actions.newPlayerCharacter({campaign_slug: campaignSlug}));
    },
    getRaces: () => {
      dispatch(rest.actions.getRaces());
    },
    createPlayerCharacter: (newCharacter, campaignSlug) => {
      dispatch(rest.actions.updateCampaign({campaign_slug: campaignSlug}, {body: JSON.stringify({newCharacter})}));
    },
    updatePlayerCharacter: (newCharacter, campaignSlug, characterSlug) => {
      dispatch(rest.actions.updatePlayerCharacter(
        {campaign_slug: campaignSlug, slug: characterSlug},
        {body: JSON.stringify({newCharacter})}
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(PlayerCharacterEditor);