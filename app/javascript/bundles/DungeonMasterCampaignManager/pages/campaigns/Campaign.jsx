import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
const ReactMarkdown = require('react-markdown');

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Container from 'react-bootstrap/Container';
import {Link, navigate} from '@reach/router';
import CharactersList from '../characters/partials/CharactersList';
import AdventuresList from '../adventures/partials/AdventuresList';
import Button from 'react-bootstrap/Button';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import AdventureForm from '../adventures/partials/AdventureForm';
import snakecaseKeys from 'snakecase-keys';
import Modal from 'react-bootstrap/Modal';

const CampaignBody = ({
  campaign,
  deleteAdventure,
  handleCancelEditing,
  handleUpdateAdventure,
  showNewAdventureForm,
  showingNewAdventureForm,
}) => (
  campaign ? (
    <Row>
      <Col sm={7} md={8}>
        <ReactMarkdown source={campaign.description} />
        <h3>Adventures</h3>
        <AdventuresList
          campaign={campaign}
          deleteAdventure={deleteAdventure}
          onUpdateAdventure={handleUpdateAdventure} />
        <Modal size={ 'lg' } show={ showingNewAdventureForm } onHide={handleCancelEditing}>
          <Modal.Header closeButton>
            <Modal.Title>New Adventure</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AdventureForm
              campaign={campaign}
              onUpdateAdventure={handleUpdateAdventure}
              onCancelEditing={handleCancelEditing}/>
          </Modal.Body>
        </Modal>
        <Button variant={'secondary'} block onClick={showNewAdventureForm}>
          New Adventure
        </Button>
      </Col>
      <Col sm={5} md={4}>
        <div className={'mb-4'}>
          <h3>Events</h3>
          <ListGroup variant="flush">
            {campaign.worldEvents.map((worldEvent, index) =>
              <ListGroupItem key={index}>
                <h4 className={'h6'}><strong>{worldEvent.when}</strong></h4>
                <p>{worldEvent.description}</p>
              </ListGroupItem>
            )}
          </ListGroup>
        </div>
        <div className={'mb-4'}>
          <h3>World Locations</h3>
          <ListGroup variant="flush">
            {campaign.worldLocations.map((location, index) =>
              <ListGroupItem key={index}>
                <h4 className={'h6'}>{location.name}</h4>
                <p>{location.description}</p>
              </ListGroupItem>
            )}
          </ListGroup>
        </div>
        <div className={'mb-4'}>
          <h3>Player Characters</h3>
          <CharactersList campaign={campaign} characters={campaign.pcs} small/>
          <Link to={`/app/campaigns/${campaign.slug}/pcs/new`} className={'btn btn-success btn-block'}>New PC</Link>
        </div>
        <div className={'mb-4'}>
          <h3>Non-player Characters</h3>
          <CharactersList campaign={campaign} characters={campaign.npcs} small/>
          <Link to={`/app/campaigns/${campaign.slug}/npcs/new`} className={'btn btn-success btn-block'}>New NPC</Link>
          <Link to={`/app/campaigns/${campaign.slug}/npcs/generate/`} className={'btn btn-secondary btn-block'}>Quick NPC</Link>
        </div>
      </Col>
    </Row>
  ) : (
    <Row>
      <Col>
        <h3>Campaign not found.</h3>
      </Col>
    </Row>
  )
);

CampaignBody.propTypes = {
  campaign: PropTypes.object,
  deleteAdventure: PropTypes.func.isRequired,
  handleCancelEditing: PropTypes.func.isRequired,
  handleUpdateAdventure: PropTypes.func.isRequired,
  showNewAdventureForm: PropTypes.func.isRequired,
  showingNewAdventureForm: PropTypes.bool,
};

class Campaign extends React.Component {
  state = {
    showingNewAdventureForm: false,
  };

  componentDidMount () {
    if (this.props.user) {
      this.props.getCampaign(this.props.campaignSlug);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  handleUpdateAdventure = (adventureBody, adventureID) => {
    if (adventureID) {
      this.props.updateAdventure(snakecaseKeys(adventureBody, {exclude: ['_destroy']}), this.props.campaignSlug, adventureID);
    } else {
      this.props.createAdventure(snakecaseKeys(adventureBody), this.props.campaignSlug);
    }
    this.setState({
      showingNewAdventureForm: false,
    });
  };

  handleCancelEditing = () => {
    this.setState({showingNewAdventureForm: false});
  };

  showNewAdventureForm = () => {
    this.setState({
      showingNewAdventureForm: !this.state.showingNewAdventureForm,
    });
  };

  render () {
    const { showingNewAdventureForm } = this.state;
    const { campaign, flashMessages, loading, user } = this.props;
    const campaignTitle = campaign ? campaign.name : 'Campaign Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={campaignTitle}
                     description={`Campaign: ${campaignTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[{url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: null, isActive: true, title: campaignTitle}]}>
        { loading ? (
          <DndSpinner />
        ) : (
          <Container fluid>
            <PageTitle title={`Campaign: ${campaign ? campaign.name : 'Campaign not found'}`}
                       subtitle={campaign ? campaign.world : ''}
                       hasButton={user && campaign && user.id === campaign.dungeonMaster.id}
                       buttonLink={campaign ? `/app/campaigns/${campaign.slug}/edit` : ''}
                       buttonTitle={'Edit Campaign'}
                       buttonVariant={'primary'}/>
            <CampaignBody campaign={campaign}
                          deleteAdventure={this.props.deleteAdventure}
                          handleCancelEditing={this.handleCancelEditing}
                          handleUpdateAdventure={this.handleUpdateAdventure}
                          showNewAdventureForm={this.showNewAdventureForm}
                          showingNewAdventureForm={showingNewAdventureForm} />
          </Container>
        )}
      </PageContainer>
    );
  }
}

Campaign.propTypes = {
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  createAdventure: PropTypes.func.isRequired,
  deleteAdventure: PropTypes.func.isRequired,
  flashMessages: PropTypes.array,
  getCampaign: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  updateAdventure: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaign: state.campaigns.currentCampaign,
    loading: state.campaigns.loading || !state.campaigns.currentCampaign,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    createAdventure: (adventure, campaignSlug) => {
      dispatch(rest.actions.createAdventure(
        {
          campaign_slug: campaignSlug,
        },
        {
          body: JSON.stringify({adventure}),
        })
      );
    },
    deleteAdventure: (campaignSlug, adventureId) => {
      dispatch(rest.actions.deleteAdventure({
        campaign_slug: campaignSlug,
        id: adventureId,
      }));
    },
    getCampaign: (campaignSlug) => {
      dispatch(rest.actions.getCampaign({slug: campaignSlug}));
    },
    updateAdventure: (adventure, campaignSlug, adventureId) => {
      dispatch(rest.actions.updateAdventure(
        {
          campaign_slug: campaignSlug,
          id: adventureId,
        },
        {
          body: JSON.stringify({adventure})
        })
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);