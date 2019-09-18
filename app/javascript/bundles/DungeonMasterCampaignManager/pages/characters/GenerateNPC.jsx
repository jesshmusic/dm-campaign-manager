/**
 * Created by jesshendricks on 9/6/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import { connect } from 'react-redux';

import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import {alignmentOptions} from '../../utilities/character-utilities';
import arrayMutators from 'final-form-arrays';
import Form from 'react-bootstrap/Form';
import FormField from '../../components/forms/FormField';
import FormSelect from '../../components/forms/FormSelect';
import RaceSelect from './partials/races/RaceSelect';
import Col from 'react-bootstrap/Col';
import {FieldArray} from 'react-final-form-arrays';
import CharacterClassFields from './partials/CharacterClassFields';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import classes from './partials/character-form.module.scss';
import {Form as FinalForm} from 'react-final-form';
import snakecaseKeys from 'snakecase-keys';


class GenerateNPC extends React.Component {
  state = {
    character: {
      name: '',
      role: '',
      alignment: '',
      raceId: 1,
      characterRace: {
        value: 1,
        label: 'Human',
        data: {
          id: 1,
          name: 'Human',
        },
      },
      dndClasses: [{
        dndClass: {
          value: 153,
          label: 'Fighter',
        },
        level: 1,
      }],
      minScore: 15,
    },
    validated: false,
  };

  handleSubmit = async (values) => {
    const nonPlayerCharacter = {
      name: values.name,
      role: values.role,
      alignment: values.characterAlignment.value,
      raceId: values.characterRace.value,
      characterClassesAttributes: values.dndClasses.map((dndClass) => {
        return {
          level: dndClass.level,
          dndClassId: dndClass.dndClass.value,
        };
      }),
      minScore: values.minScore,
    };
    this.props.generateNonPlayerCharacter(snakecaseKeys(nonPlayerCharacter), this.props.campaignSlug);
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Character name is required.';
    }
    if (!values.characterAlignment) {
      errors.characterAlignment = 'Character alignment is required.';
    }
    if (!values.dndClasses || values.dndClasses.count === 0) {
      errors.dndClasses = 'Please add at least 1 class.';
    }
    return errors;
  };

  render () {
    const {
      campaignSlug,
      flashMessages,
      user,
    } = this.props;
    const { character, validated } = this.state;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={'Quick NPC'}
                     description={'Quick NPC Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignSlug}`, isActive: false, title: 'Campaign'},
                       {url: null, isActive: true, title: 'Quick NPC'},
                     ]}>
        <PageTitle title={'Quick NPC'}/>
        <FinalForm onSubmit={this.handleSubmit}
                   initialValues={character}
                   validate={this.validate}
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
                         <FormField
                           label={'Character name'}
                           type={'text'}
                           colWidth={'5'}
                           name={'name'}/>
                         <FormField
                           label={'NPC Role'}
                           type={'text'}
                           colWidth={'5'}
                           name={'role'}
                           infoText={'(Villain, Lord, Blacksmith, etc.)'}
                         />
                         <FormField
                           label={'Min Score'}
                           type={'number'}
                           colWidth={'2'}
                           name={'minScore'}
                           infoText={'Make sure the primary ability is at least this score.'}
                         />
                       </Form.Row>
                       <Form.Row>
                         <FormSelect label={'Alignment'} colWidth={'6'} name={'characterAlignment'} options={alignmentOptions}/>
                         <RaceSelect colWidth={'6'}/>
                       </Form.Row>
                       <h2>Classes</h2>
                       <Form.Row>
                         <Col md={{ span: 8, offset: 2 }} className={'mb-5'}>
                           <FieldArray name="dndClasses">
                             {({ fields }) =>
                               fields.map((characterClass, index) => (
                                 !fields.value[index] || !fields.value[index]._destroy ? (
                                   <CharacterClassFields characterClass={characterClass}
                                                         fields={fields}
                                                         index={index}
                                                         key={index}/>
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
                       <Form.Row>
                         <ButtonGroup aria-label="Character actions">
                           <Button type="submit" disabled={submitting}>Generate NPC</Button>
                           <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'secondary'}>Reset</Button>
                         </ButtonGroup>
                       </Form.Row>
                     </Form>
                   )}
        />
      </PageContainer>
    );
  }
}

GenerateNPC.propTypes = {
  campaignSlug: PropTypes.string.isRequired,
  flashMessages: PropTypes.array,
  generateNonPlayerCharacter: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    flashMessages: state.flashMessages,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    generateNonPlayerCharacter: (non_player_character, campaignSlug) => {
      dispatch(rest.actions.generateNonPlayerCharacter(
        {campaign_slug: campaignSlug},
        {body: JSON.stringify({non_player_character})}
      ));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GenerateNPC);