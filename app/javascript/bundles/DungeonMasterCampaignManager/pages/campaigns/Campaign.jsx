import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';

const ReactMarkdown = require('react-markdown');


// Container
import PageContainer from '../../containers/PageContainer.jsx';
import rest from '../../actions/api';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import BreadcrumbLink from '../../components/layout/BreadcrumbLink';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Container from 'react-bootstrap/Container';
import { Link } from '@reach/router';

class Campaign extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaign(this.props.campaignSlug);
  }

  render () {
    const { user, flashMessages, campaign } = this.props;
    const campaignTitle = campaign ? campaign.name : 'Campaign Loading...';
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle={campaignTitle}
                     description={`Campaign: ${campaignTitle}. Dungeon Master's Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.`}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'} />
            <BreadcrumbLink to='/app/campaigns' title={'Campaigns'} />
            <Breadcrumb.Item active>{campaignTitle}</Breadcrumb.Item>
          </Breadcrumb>
          { campaign ? (
            <Container>
              <Row>
                <Col>
                  <ReactMarkdown source={campaign.description} />
                </Col>
                <Col>
                  <h3>Dungeon Master</h3>
                  <h4 className='h5 mb-0'>{campaign.dungeonMaster.name}</h4>
                  <h3>Player Characters</h3>
                  <ListGroup variant="flush">
                    {campaign.pcs.map((character, index) =>
                      <ListGroupItem key={index}>
                        {character.name} ({character.classes})
                      </ListGroupItem>
                    )}
                  </ListGroup>
                  <h3>Non-player Characters</h3>
                  <ListGroup variant="flush">
                    {campaign.npcs.map((character, index) =>
                      <ListGroupItem key={index}>
                        <strong>{character.role}</strong> - {character.name} ({character.classes})
                      </ListGroupItem>
                    )}
                  </ListGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3>World Locations</h3>
                  <ListGroup variant="flush">
                    {campaign.worldLocations.map((location, index) =>
                      <ListGroupItem key={index}>
                        <h4 className={'h6'}>{location.name}</h4>
                        <p>{location.description}</p>
                      </ListGroupItem>
                    )}
                  </ListGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  <h3>Events</h3>
                  <ListGroup variant="flush">
                    {campaign.worldEvents.map((worldEvent, index) =>
                      <ListGroupItem key={index}>
                        <h4 className={'h6'}><strong>{worldEvent.when}</strong> -  {worldEvent.name}</h4>
                        <p>{worldEvent.description}</p>
                      </ListGroupItem>
                    )}
                  </ListGroup>
                </Col>
              </Row>
              <Row>
                <Col>
                  {user && user.id === campaign.dungeonMaster.id ? (
                    <Link to={`/app/campaigns/${campaign.slug}/edit`} className={'btn btn-primary'}>
                      Edit Campaign
                    </Link>
                  ) : null }
                </Col>
              </Row>
            </Container>
          ) : (
            <Spinner animation="border" variant="primary" />
          )}
        </div>
      </PageContainer>
    );
  }
}

Campaign.propTypes = {
  campaign: PropTypes.object,
  campaignSlug: PropTypes.string.isRequired,
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
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaign);