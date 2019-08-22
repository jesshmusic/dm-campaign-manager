import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';

const ReactMarkdown = require('react-markdown');


// Container
import PageContainer from '../containers/PageContainer.jsx';
import rest from '../actions/api';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import BreadcrumbLink from '../components/layout/BreadcrumbLink';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

class Campaign extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaign(this.props.campaignSlug);
  }

  render () {
    const { user, flashMessages, campaign } = this.props;
    return (
      campaign ? (
        <PageContainer user={user} flashMessages={flashMessages} pageTitle={campaign.name}>
          <div>
            <Breadcrumb>
              <BreadcrumbLink to='/' title={'Home'} />
              <BreadcrumbLink to='/app/campaigns' title={'Campaigns'} />
              <Breadcrumb.Item active>{campaign.name}</Breadcrumb.Item>
            </Breadcrumb>
            <Row>
              <Col>
                <ReactMarkdown source={campaign.description} />
              </Col>
              <Col>
                <h3>Dungeon Master</h3>
                <h4 className='h5 mb-0'>{campaign.user.name}</h4>
                <h3>Players</h3>
                <ListGroup>
                  {campaign.users.map((user, index) =>
                    <ListGroupItem key={index}>
                      <h4 className='h5 mb-0'>{user.name}</h4>
                      <ListGroup>
                        {campaign.characters.map((character, index) =>
                          character.user_id === user.id ? (
                            <ListGroupItem key={index}>{character.name}, Level {character.level}</ListGroupItem>
                          ) : null
                        )}
                      </ListGroup>
                    </ListGroupItem>
                  )}
                </ListGroup>
              </Col>
            </Row>
          </div>
        </PageContainer>
      ) : (
        <PageContainer user={user} flashMessages={flashMessages} pageTitle='Campaign Loading...'>
          <div>
            <Breadcrumb>
              <BreadcrumbLink to='/' title={'Home'} />
              <BreadcrumbLink to='/app/campaigns' title={'Campaigns'} />
              <Breadcrumb.Item active>Campaign</Breadcrumb.Item>
            </Breadcrumb>
            <Spinner animation="border" variant="primary" />
          </div>
        </PageContainer>
      )
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