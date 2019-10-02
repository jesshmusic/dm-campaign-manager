/**
 * Created by jesshendricks on 9/24/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import rest, {getHeaders} from '../../actions/api';
import {connect} from 'react-redux';
import PageContainer from '../../containers/PageContainer';
import DndSpinner from '../../components/layout/DndSpinner';
import Container from 'react-bootstrap/Container';
import PageTitle from '../../components/layout/PageTitle';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ReactMarkdown from 'react-markdown';
import ListGroup from 'react-bootstrap/ListGroup';
import {Link, navigate} from '@reach/router';
import snakecaseKeys from 'snakecase-keys';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import InputGroup from 'react-bootstrap/InputGroup';

class Encounter extends React.Component {
  state = {
    currentCombatant: 0,
    encounterCombatants: [],
    inProgress: false,
    round: 1,
  };

  updateCombat = (changes) => {
    console.log(changes);
    const encounterFields = {
      encounter: {
        inProgress: changes.inProgress !== undefined ?
          changes.inProgress : this.state.inProgress,
        currentMobIndex: changes.currentCombatant !== undefined ?
          changes.currentCombatant : this.state.currentCombatant,
        round: changes.round !== undefined ?
          changes.round : this.state.round,
        encounterCombatantsAttributes: changes.encounterCombatants !== undefined ?
          changes.encounterCombatants.map((combatant) => ({
            id: combatant.id,
            combatOrderNumber: combatant.combatOrderNumber,
            currentHitPoints: combatant.currentHitPoints,
            initiativeRoll: combatant.initiativeRoll,
            notes: combatant.notes ? combatant.notes : '',
          })) :
          this.state.encounterCombatants.map((combatant) => ({
            id: combatant.id,
            combatOrderNumber: combatant.combatOrderNumber,
            currentHitPoints: combatant.currentHitPoints,
            initiativeRoll: combatant.initiativeRoll,
            notes: combatant.notes ? combatant.notes : '',
          })),
      },
    };
    fetch(`/v1/campaigns/${this.props.campaignSlug}/adventures/${this.props.adventureId}/encounters/${this.props.id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(snakecaseKeys(encounterFields)),
    }).then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
      });
  };

  incrementCombatant = () => {
    let currentRound = this.state.round;
    let currentCombatant = this.state.currentCombatant;
    if (this.state.currentCombatant + 1 < this.state.encounterCombatants.length) {
      currentCombatant = this.state.currentCombatant + 1;
      this.setState({ currentCombatant });
    } else {
      currentCombatant = 0;
      currentRound += 1;
      this.setState({
        currentCombatant,
        round: currentRound,
      });
    }

    this.updateCombat({currentCombatant, round: currentRound});
  };

  addIntiativeForCombatant = (combatantIndex, initiative) => {
    const initiativeInt = initiative ? parseInt(initiative, 10) : 0;
    if (combatantIndex < this.state.encounterCombatants.length && combatantIndex >= 0) {
      const encounterCombatants = [...this.state.encounterCombatants];
      encounterCombatants[combatantIndex].initiativeRoll = initiativeInt;
      this.setState({
        encounterCombatants,
      });
    }
  };

  sortCombatants = () => {
    const encounterCombatants = [...this.state.encounterCombatants];
    encounterCombatants.sort((a, b) => b.initiativeRoll - a.initiativeRoll);
    encounterCombatants.forEach((encounterCombatant, index) => {
      encounterCombatant.combatOrderNumber = index;
    });
    this.setState({
      encounterCombatants,
    });
    this.updateCombat({encounterCombatants});
  };

  adjustHitPointsForCombatant = (combatantIndex, hitPointChange) => {
    if (combatantIndex < this.state.encounterCombatants.length && combatantIndex > 0) {
      const encounterCombatants = [...this.state.encounterCombatants];
      encounterCombatants[combatantIndex].currentHitPoints += hitPointChange;
      this.setState({
        encounterCombatants,
      });

      this.updateCombat({encounterCombatants});
    }
  };

  onStartEncounter = () => {
    this.setState({
      inProgress: true,
    });
    this.updateCombat({inProgress: true});
  };

  onStopEncounter = () => {
    this.setState({
      inProgress: false,
    });
    this.updateCombat({inProgress: false});
  };

  resetEncounter = () => {
    const encounterCombatants = [...this.state.encounterCombatants];
    encounterCombatants.sort((a, b) => a.id - b.id);
    this.setState({
      inProgress: false,
      currentMobIndex: 0,
      round: 1,
      encounterCombatants: encounterCombatants.map((combatant, index) => ({
        id: combatant.id,
        combatOrderNumber: index,
        currentHitPoints: combatant.combatant.hitPoints,
        initiativeRoll: 0,
        notes: '',
        combatant: combatant.combatant,
      })),
    });
    this.updateCombat({
      inProgress: false,
      currentMobIndex: 0,
      round: 1,
      encounterCombatants: encounterCombatants.map((combatant, index) => ({
        id: combatant.id,
        combatOrderNumber: index,
        currentHitPoints: combatant.combatant.hitPoints,
        initiativeRoll: 0,
        notes: '',
      })),
    });
  };

  componentDidMount () {
    if (this.props.user) {
      this.props.getEncounter(this.props.campaignSlug, this.props.adventureId, this.props.id);
    } else {
      window.location.href = '/users/sign_in';
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.id !== prevProps.id && this.props.user) {
      this.props.getEncounter(this.props.campaignSlug, this.props.adventureId, this.props.id);
    }
    if ( this.props.encounter &&
     ( (this.props.encounter && !prevProps.encounter) ||
      this.props.encounter.id !== prevProps.encounter.id)) {
      this.initializeEncounter();
    }
  }

  initializeEncounter () {
    const currentEncounter = this.props.encounter;
    this.setState({
      currentCombatant: currentEncounter.encounterState.currentCombatant,
      encounterCombatants: currentEncounter.combatants,
      inProgress: currentEncounter.encounterState.inProgress,
      round: currentEncounter.encounterState.round,
    });
  }

  render () {
    const { inProgress, round } = this.state;
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
                       subtitle={adventure.pcs.length > 0 ? (
                         `${encounter.xp / adventure.pcs.length}xp per character`
                       ) : (
                         `${encounter.xp}xp divided by number of party members`
                       )}
                       hasButton={user && user.id === campaign.dungeonMaster.id}
                       buttonLink={`/app/campaigns/${campaignSlug}/adventures/${adventureId}/encounters/${id}/edit`}
                       buttonTitle={'Edit Encounter'}
                       buttonVariant={'primary'}/>
            <Row>
              <Col xs={'6'}>
                <Link to={`/app/campaigns/${campaignSlug}/adventures/${adventureId}/encounters/${encounter.prevEncounterId}`}
                      className={'d-block text-sm-left'}>
                  Previous
                </Link>
              </Col>
              <Col xs={'6'}>
                <Link to={`/app/campaigns/${campaignSlug}/adventures/${adventureId}/encounters/${encounter.nextEncounterId}`}
                      className={'d-block text-sm-right'}>
                  Next
                </Link>
              </Col>
            </Row>
            {inProgress ? (
              <Row>
                <Col>
                  <Card>
                    <Card.Header>
                      <Card.Title>In Progress...</Card.Title>
                    </Card.Header>
                    <Card.Body>
                      <p className={'lead'}><strong>Round:</strong> {round}</p>
                      <ButtonToolbar aria-label={'Encounter actions'} className={'justify-content-between'}>
                        <ButtonGroup>
                          <Button variant={'secondary'} onClick={this.sortCombatants}>Set Combat Order</Button>
                          <Button variant={'primary'} onClick={this.incrementCombatant}>Next Combatant</Button>
                        </ButtonGroup>
                        <ButtonGroup>
                          <Button variant={'dark'} onClick={this.resetEncounter}>Reset Encounter</Button>
                        </ButtonGroup>
                      </ButtonToolbar>
                    </Card.Body>
                    {this.state.encounterCombatants.map((nextMob, index) => (
                      <Card key={nextMob.id}
                            className={`m-2${
                              this.state.currentCombatant === index ? ' text-white bg-primary' : ''
                            }${
                              nextMob.currentHitPoints <= 0 ? ' text-muted' : ''
                            }`}>
                        <Card.Body className={'d-flex justify-content-between align-items-center'}>
                          <span>
                            <strong>{nextMob.combatant.name}, Initiative: </strong>
                            {nextMob.initiativeRoll} -- <strong>AC: </strong>
                            {nextMob.combatant.armorClass} -- <strong>HP: </strong>
                            {nextMob.currentHitPoints}/{nextMob.combatant.hitPoints}
                          </span>
                          <Form.Group controlId={`initiativeRoll${nextMob.id}`}
                                      className={'d-flex align-items-center mb-0'}>
                            <Form.Label className={'mr-1 mb-0'}>
                              Initiative
                            </Form.Label>
                            <Form.Control
                              className={'mb-0'}
                              placeholder={'Initiative'}
                              onChange={(event) => this.addIntiativeForCombatant(index, event.target.value)}
                              type={'number'}
                              defaultValue={this.state.encounterCombatants[index].initiativeRoll}
                            />
                          </Form.Group>
                        </Card.Body>
                        {this.state.currentCombatant === index ? (
                          <Card.Footer>
                            <InputGroup>
                              <Form.Control
                                placeholder="Hit Points Change"
                                aria-label="Hit Points Change"
                                aria-describedby="basic-addon2"
                                type={'number'}
                              />
                              <InputGroup.Append>
                                <Button variant="success">Heal</Button>
                                <Button variant="secondary">Damage</Button>
                              </InputGroup.Append>
                            </InputGroup>
                          </Card.Footer>
                        ) : null}
                      </Card>
                    ))}
                    <Button variant={'primary'} onClick={this.onStopEncounter} block>Stop Encounter</Button>
                  </Card>
                </Col>
              </Row>
            ) : (
              <Button variant={'primary'} onClick={this.onStartEncounter} block>Run Encounter</Button>
            )}
            <Row>
              <Col>
                <ReactMarkdown source={ encounter.description }/>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>NPCs</h4>
                <ListGroup variant="flush">
                  {encounter.npcs.map((npc) => (
                    <ListGroup.Item key={npc.id}>
                      <strong>{npc.name}</strong> : {npc.classes} - <strong className={'text-muted'}>{npc.role}</strong>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <h4>Treasure</h4>
              </Col>
            </Row>
            <Row>
              <Col md={4} sm={6}>
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
              </Col>
              <Col md={8} sm={6}>
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
  updateEncounter: PropTypes.func.isRequired,
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
    getEncounter (campaignSlug, adventureId, encounterId) {
      dispatch(rest.actions.getEncounter({
        id: encounterId,
        campaign_slug: campaignSlug,
        adventure_id: adventureId,
      }));
    },
    updateEncounter: (encounter, campaignSlug, adventureId, encounterId) => {
      dispatch(rest.actions.updateEncounter({
        campaign_slug: campaignSlug,
        adventure_id: adventureId,
        id: encounterId,
      }, {body: JSON.stringify({encounter})}, () => {
        navigate(`/app/campaigns/${campaignSlug}/adventures/${adventureId}/encounters/${encounterId}`);
      }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Encounter);