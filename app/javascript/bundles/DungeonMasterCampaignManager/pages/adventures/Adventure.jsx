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
import {Link} from '@reach/router';

class Adventure extends React.Component {
  componentDidMount () {
    if (this.props.user) {
      this.props.getAdventure(this.props.campaignSlug, this.props.id);
    } else {
      window.location.href = '/users/sign_in';
    }
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
    const { adventure, campaign, campaignSlug, flashMessages, loading, user } = this.props;
    const adventureTitle = adventure ? adventure.name : 'Adventure Loading...';
    let sortNum = 0;
    if (adventure) {
      adventure.encounters.forEach((nextEncounter) => {
        if (nextEncounter.sort >= sortNum) {
          sortNum = nextEncounter.sort + 1;
        }
      });
    }
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
                <div dangerouslySetInnerHTML={{ __html: adventure.description }} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h3>Encounters</h3>
                <Link to={`/app/campaigns/${campaign.slug}/adventures/${adventure.id}/encounters/new`}
                      className={'btn btn-secondary btn-block mb-3'}>
                  New Encounter
                </Link>
                <EncountersList adventure={adventure}
                                campaign={campaign}
                                small/>
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