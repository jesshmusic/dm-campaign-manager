import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import snakecaseKeys from 'snakecase-keys';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Spinner from 'react-bootstrap/Spinner';

import { Form as FinalForm } from 'react-final-form';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';

import classes from './edit-campaign.module.scss';
import FormField from '../../components/forms/FormField';
import FormTextArea from '../../components/forms/FormTextArea';
import WorldLocationFields from './partials/WorldLocationFields';
import WorldEventFields from './partials/WorldEventFields';

class EditCampaign extends React.Component {
  state = {
    currentCampaign: {
      name: '',
      world: '',
      description: '',
    },
    validated: false,
  };

  componentDidMount () {
    this.props.getCampaign(this.props.campaignSlug);
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.campaign !== this.props.campaign ) {
      this.setState({currentCampaign: this.props.campaign});
    }
  }

  handleSubmit = async (values) => {
    const pcIds = values.pcs.map((pc) => pc.id);
    const npcIds = values.npcs.map((npc) => npc.id);
    const campaignBody = {
      id: values.id,
      name: values.name,
      description: values.description,
      world: values.world,
      characterIds: pcIds.concat(npcIds),
      worldLocationsAttributes: values.worldLocations,
      worldEventsAttributes: values.worldEvents,
    };
    this.props.updateCampaign(snakecaseKeys(campaignBody, {exclude: ['_destroy']}), this.props.campaignSlug);
  };

  validate = (values) => {
    const errors = {};
    if (!values.name) {
      errors.name = 'Campaign name is required';
    }
    return errors;
  };

  render () {
    const { user, flashMessages } = this.props;
    const {currentCampaign, validated} = this.state;
    const campaignTitle = `Edit Campaign: ${currentCampaign.name}`;

    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={campaignTitle}
                     description={`Edit Campaign: ${campaignTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'} />
            <BreadcrumbLink to='/app/campaigns' title={'Campaigns'} />
            <Breadcrumb.Item active>Campaign</Breadcrumb.Item>
          </Breadcrumb>
          { currentCampaign ? (
            <FinalForm onSubmit={this.handleSubmit}
                       initialValues={currentCampaign}
                       validate={this.validate}
                       mutators={{...arrayMutators }}
                       render={({
                         handleSubmit,
                         form: {
                           mutators: { push, pop },
                         },
                         submitting,
                         form,
                         pristine,
                         values,
                       }) => (
                         <Form noValidate validated={validated} onSubmit={handleSubmit}>
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
                             <FormTextArea label={'Description'} colWidth={'12'} name={'description'}/>
                           </Form.Row>
                           <h2>World Locations</h2>
                           <Form.Row>
                             <ButtonGroup aria-label="World Locations Actions">
                               <Button type="button" onClick={() => push('worldLocations', undefined)} variant={'info'}>Add World Location</Button>
                               <Button type="button" onClick={() => pop('worldLocations')} variant={'warning'}>Remove World Location</Button>
                             </ButtonGroup>
                           </Form.Row>
                           <FieldArray name="worldLocations">
                             {({ fields }) =>
                               fields.map((world_location, index) => (!fields.value[index]._destroy ? (
                                 <WorldLocationFields location={world_location}
                                                      fields={fields}
                                                      index={index}
                                                      key={index} />
                               ) : null))
                             }
                           </FieldArray>
                           <h2>World Events</h2>
                           <Form.Row>
                             <ButtonGroup aria-label="World Events Actions">
                               <Button type="button" onClick={() => push('worldEvents', undefined)} variant={'info'}>Add World Event</Button>
                               <Button type="button" onClick={() => pop('worldEvents')} variant={'warning'}>Remove World Event</Button>
                             </ButtonGroup>
                           </Form.Row>
                           <FieldArray name="worldEvents">
                             {({ fields }) =>
                               fields.map((event, index) => (!fields.value[index]._destroy ? (
                                 <WorldEventFields event={event}
                                                   fields={fields}
                                                   index={index}
                                                   key={index} />
                               ) : null))
                             }
                           </FieldArray>
                           <Form.Row>
                             <ButtonGroup aria-label="Campaign actions">
                               <Button type="submit" disabled={submitting}>Update Campaign</Button>
                               <Button type="button" onClick={form.reset} disabled={submitting || pristine} variant={'secondary'}>Reset</Button>
                             </ButtonGroup>
                           </Form.Row>
                           <pre className={classes.preBlock}>{JSON.stringify(values, 0, 2)}</pre>
                         </Form>
                       )} />

          ) : (
            <Spinner animation="border" variant="primary" />
          )}
        </div>
      </PageContainer>
    );
  }
}

EditCampaign.propTypes = {
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  updateCampaign: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getCampaign: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaign: state.campaigns.currentCampaign,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCampaign: (campaignSlug) => {
      dispatch(rest.actions.getCampaign({slug: campaignSlug}));
    },
    updateCampaign: (campaign, campaginSlug) => {
      dispatch(rest.actions.updateCampaign({slug: campaginSlug}, {body: JSON.stringify({campaign})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCampaign);