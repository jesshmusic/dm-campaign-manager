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
import ListGroup from 'react-bootstrap/ListGroup';

class Encounter extends React.Component {
  state = {};

  componentDidMount () {
    if (this.props.user) {
      this.props.getEncounter(this.props.campaignSlug, this.props.adventureId, this.props.id);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  render () {
    // const {} = this.state;
    const { adventure, adventureId, campaign, campaignSlug, encounter, flashMessages, id, loading, user } = this.props;
    const encounterTitle = encounter ? encounter.name : 'Encounter Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={encounterTitle}
                     description={`Encounter: ${encounterTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}
                     breadcrumbs={[
                       {url: '/app/campaigns', isActive: false, title: 'Campaigns'},
                       {url: `/app/campaigns/${campaignSlug}`, isActive: false, title: (campaign ? campaign.name : 'Campaign loading...')},
                       {url: `/app/campaigns/${campaignSlug}/adventures/${adventureId}`, isActive: false, title: (adventure ? adventure.name : 'Adventure loading...')},
                       {url: null, isActive: true, title: encounterTitle},
                     ]}>
        { loading ? (
          <DndSpinner/>
        ) : (
          <Container>
            <PageTitle title={encounter.name}
                       hasButton={user && user.id === campaign.dungeonMaster.id}
                       buttonLink={`/app/campaigns/${campaignSlug}/adventures/${adventureId}/encounters/${id}/edit`}
                       buttonTitle={'Edit Encounter'}
                       buttonVariant={'primary'}/>
            <Row>
              <Col>
                <h4 className={ 'mb-0' }>XP</h4>
                { adventure.pcs.length > 0 ? (
                  `${encounter.xp / adventure.pcs.length}xp per character`
                ) : (
                  `${encounter.xp}xp divided by number of party members`
                ) }
              </Col>
            </Row>
            <Row>
              <Col>
                <ReactMarkdown source={ encounter.description }/>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>Treasure</h4>
                <h5>Coin</h5>
                <ListGroup variant="flush">
                  { encounter.copperPieces && encounter.copperPieces > 0 ? (
                    <ListGroup.Item>
                      <strong className={ 'text-muted' }>
                        Copper
                      </strong>&nbsp;&nbsp;{ encounter.copperPieces }
                    </ListGroup.Item>
                  ) : null }
                  { encounter.silverPieces && encounter.silverPieces > 0 ? (
                    <ListGroup.Item>
                      <strong className={ 'text-muted' }>
                        Silver
                      </strong>&nbsp;&nbsp;{ encounter.silverPieces }
                    </ListGroup.Item>
                  ) : null }
                  { encounter.electrumPieces && encounter.electrumPieces > 0 ? (
                    <ListGroup.Item>
                      <strong className={ 'text-muted' }>
                        Electrum
                      </strong>&nbsp;&nbsp;{ encounter.electrumPieces }
                    </ListGroup.Item>
                  ) : null }
                  { encounter.goldPieces && encounter.goldPieces > 0 ? (
                    <ListGroup.Item>
                      <strong className={ 'text-muted' }>
                        Gold
                      </strong>&nbsp;&nbsp;{ encounter.goldPieces }
                    </ListGroup.Item>
                  ) : null }
                  { encounter.platinumPieces && encounter.platinumPieces > 0 ? (
                    <ListGroup.Item>
                      <strong className={ 'text-muted' }>
                        Platinum
                      </strong>&nbsp;&nbsp;{ encounter.platinumPieces }
                    </ListGroup.Item>
                  ) : null }
                </ListGroup>
                <h5>Items</h5>
                <ListGroup variant="flush">
                  {encounter.encounterItems.map((item) => (
                    <ListGroup.Item key={item.id}>
                      <strong>{item.item.name}</strong> quantity: {item.quantity}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>Monsters</h4>
                <ListGroup variant="flush">
                  {encounter.encounterMonsters.map((monster) => (
                    <ListGroup.Item key={monster.id}>
                      <strong>{monster.monster.name}</strong> : {monster.numberOfMonsters} - <strong className={'text-muted'}>CR: {monster.monster.challengeRating}</strong>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
          </Container>
        )}
      </PageContainer>
    );
  }
}

Encounter.propTypes = {
  adventure: PropTypes.object,
  adventureId: PropTypes.string.isRequired,
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
  encounter: PropTypes.object,
  flashMessages: PropTypes.array,
  getEncounter: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    adventure: state.adventures.currentAdventure,
    campaign: state.campaigns.currentCampaign,
    encounter: state.encounters.currentEncounter,
    flashMessages: state.flashMessages,
    loading: state.encounters.loading ||
      !state.adventures.currentAdventure ||
      !state.campaigns.currentCampaign ||
      !state.encounters.currentEncounter,
    user: state.users.user,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getEncounter(campaignSlug, adventureId, encounterId) {
      dispatch(rest.actions.getEncounter({
        id: encounterId,
        campaign_slug: campaignSlug,
        adventure_id: adventureId,
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Encounter);