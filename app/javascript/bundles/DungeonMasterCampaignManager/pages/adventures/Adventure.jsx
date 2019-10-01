/**
 * Created by jesshendricks on 9/24/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest from '../../actions/api';
import {connect} from 'react-redux';
import PageContainer from '../../containers/PageContainer';
import DndSpinner from '../../components/layout/DndSpinner';
import Container from 'react-bootstrap/Container';
import PageTitle from '../../components/layout/PageTitle';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactMarkdown from 'react-markdown';
import EncountersList from '../encounters/partials/EncountersList';
import EncounterForm from '../encounters/partials/EncounterForm';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class Adventure extends React.Component {
  state = {
    showingNewEncounterForm: false,
  };

  componentDidMount () {
    if (this.props.user) {
      this.props.getAdventure(this.props.campaignSlug, this.props.id);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  handleCancelEditing () {
    this.setState({showingNewEncounterForm: false});
  }

  showNewEncounterForm () {
    this.setState({
      showingNewEncounterForm: !this.state.showingNewEncounterForm,
    });
  }

  get totalXP () {
    let totalXP = 0;
    const adventure = this.props.adventure;
    adventure.encounters.forEach((encounter) => {
      totalXP += encounter.xp;
    });
    return adventure.pcs.length > 0 ? (
      `${Math.ceil(totalXP / adventure.pcs.length)}xp per character`
    ) : (
      `${totalXP}xp divided by number of party members`
    );
  }

  render () {
    const { showingNewEncounterForm } = this.state;
    const { adventure, campaign, campaignSlug, flashMessages, loading, user } = this.props;
    const adventureTitle = adventure ? adventure.name : 'Adventure Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={adventureTitle}
                     description={`Adventure: ${adventureTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignSlug}`, isActive: false, title: (campaign ? campaign.name : 'Campaign loading...')},
                       {url: null, isActive: true, title: adventureTitle}
                     ]}>
        { loading ? (
          <DndSpinner/>
        ) : (
          <Container>
            <PageTitle title={adventure.name}
                       subtitle={`${adventure.worldLocation ? adventure.worldLocation.label : ''} - ${this.totalXP}`}
                       hasButton={user && user.id === campaign.dungeonMaster.id}
                       buttonLink={`/app/campaigns/${campaign.slug}/adventures/${adventure.id}/edit`}
                       buttonTitle={'Edit Adventure'}
                       buttonVariant={'primary'}/>
            <Row className={'border-bottom'}>
              <Col lg={6}>
                <h5 className={'mb-0'}>Players</h5>
                {adventure.pcs.map((pc) => (
                  <div key={pc.id}>
                    <strong>{pc.name}</strong> {pc.classes}
                  </div>
                ))}
              </Col>
              <Col lg={6}>
                <h5 className={'mb-0'}>NPCs</h5>
                {adventure.npcs.map((npc) => (
                  <div key={npc.id}>
                    <strong>{npc.name}</strong> {npc.classes}
                  </div>
                ))}
              </Col>
            </Row>
            <Row>
              <Col>
                <ReactMarkdown source={adventure.description} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h3>Encounters</h3>
                <Button variant={'secondary'}
                        block
                        className={'mb-3'}
                        onClick={() => this.showNewEncounterForm()}>
                  New Encounter
                </Button>
                <EncountersList adventure={adventure}
                                campaign={campaign}
                                small/>
                <Modal size={'lg'} show={showingNewEncounterForm} onHide={() => this.handleCancelEditing()}>
                  <Modal.Header closeButton>
                    <Modal.Title>New Encounter</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <EncounterForm
                      adventure={adventure}
                      campaign={campaign}
                      onCancelEditing={() => this.handleCancelEditing()}/>
                  </Modal.Body>
                </Modal>
              </Col>
            </Row>
          </Container>
        )}
      </PageContainer>
    );
  }
}

Adventure.propTypes = {
  adventure: PropTypes.object,
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  flashMessages: PropTypes.array,
  getAdventure: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    adventure: state.adventures.currentAdventure,
    campaign: state.campaigns.currentCampaign,
    flashMessages: state.flashMessages,
    loading: state.adventures.loading || !state.adventures.currentAdventure || ! state.campaigns.currentCampaign,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getAdventure(campaignSlug, adventureId) {
      dispatch(rest.actions.getAdventure({id: adventureId, campaign_slug: campaignSlug}));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Adventure);