import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import {Link} from '@reach/router';
import CharactersList from '../characters/partials/CharactersList';
import AdventuresList from '../adventures/partials/AdventuresList';
import Button from 'react-bootstrap/Button';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import AdventureForm from '../adventures/partials/AdventureForm';
import snakecaseKeys from 'snakecase-keys';
import Modal from 'react-bootstrap/Modal';
import Card from 'react-bootstrap/Card';

const CampaignBody = ({
  campaign,
}) => (
  campaign ? (
    <Row>
      <Col sm={7} md={8}>
        <div dangerouslySetInnerHTML={{ __html: campaign.description }} />
        <h3>Adventures</h3>
        <Link to={`/app/campaigns/${campaign.slug}/adventures/new`} className={'btn btn-success btn-block mb-3'}>
          New Adventure
        </Link>
        <AdventuresList
          campaign={campaign}
          small
        />
      </Col>
      <Col sm={5} md={4}>
        <div className={'mb-4'}>
          <h3>Events</h3>
          {campaign.worldEvents.map((worldEvent, index) => (
            <Card key={index} className={'mb-1'}>
              <Card.Body>
                <strong>{worldEvent.when}</strong>
                <p>{worldEvent.description}</p>
              </Card.Body>
            </Card>
          ))}
        </div>
        <div className={'mb-4'}>
          <h3>World Locations</h3>
          {campaign.worldLocations.map((worldLocation, index) => (
            <Card key={index} className={'mb-1'}>
              <Card.Body>
                <strong>{worldLocation.name}</strong>
                <p>{worldLocation.description}</p>
              </Card.Body>
            </Card>
          ))}
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
};

class Campaign extends React.Component {

  componentDidMount () {
    if (this.props.user) {
      this.props.getCampaign(this.props.campaignSlug);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  render () {
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
            <CampaignBody campaign={campaign} />
          </Container>
        )}
      </PageContainer>
    );
  }
}

Campaign.propTypes = {
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  flashMessages: PropTypes.array,
  getCampaign: PropTypes.func.isRequired,
  loading: PropTypes.bool,
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
    getCampaign: (campaignSlug) => {
      dispatch(rest.actions.getCampaign({slug: campaignSlug}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);