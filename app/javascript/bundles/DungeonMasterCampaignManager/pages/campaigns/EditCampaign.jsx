import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

import { Form as FinalForm, Field } from 'react-final-form';

import classes from './edit-campaign.module.scss';
import FormField from '../../components/forms/FormField';
import FormTextArea from '../../components/forms/FormTextArea';

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
    console.log('Submitted');
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
                       render={({ handleSubmit, form, submitting, pristine, values }) => (
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
                           <Button type="submit" disabled={submitting}>Update Campaign</Button>
                           <Button type="button" onClick={form.reset} disabled={submitting || pristine}>Reset</Button>
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
  editCampaign: PropTypes.func.isRequired,
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
    editCampaign: (campaign) => {
      dispatch(rest.actions.editCampaign({slug: campaign.slug}, {body: JSON.stringify({campaign})}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCampaign);