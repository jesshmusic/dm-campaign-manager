import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from '@reach/router';
import BreadcrumbLink from '../components/layout/BreadcrumbLink';

const ReactMarkdown = require('react-markdown');


// Container
import PageContainer from '../containers/PageContainer.jsx';
import rest from '../actions/api';
import ListGroup from 'react-bootstrap/ListGroup';
import Breadcrumb from 'react-bootstrap/Breadcrumb';

class Campaigns extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaigns();
  }

  render () {
    return (
      <PageContainer user={this.props.user} flashMessages={this.props.flashMessages} pageTitle={'Campaigns'}>
        <div>
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'} />
            <Breadcrumb.Item active>Campaigns</Breadcrumb.Item>
          </Breadcrumb>
          <ListGroup>
            {this.props.campaigns.campaigns.map((campaign) =>
              <ListGroup.Item key={campaign.slug}>
                <Link to={`/app/campaigns/${campaign.slug}`}>
                  {campaign.name} - {campaign.user.name}
                </Link>
              </ListGroup.Item>
            )}
          </ListGroup>
          {this.props.user && this.props.campaigns.playerCampaigns ? (
            <div>
              <h2>My Campaigns</h2>
              <ListGroup>
                {this.props.campaigns.playerCampaigns.map((campaign) =>
                  <ListGroup.Item key={campaign.slug}>
                    <Link to={`/app/campaigns/${campaign.slug}`}>
                      {campaign.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          ) : null}
          {this.props.user && this.props.campaigns.dmCampaigns ? (
            <div>
              <h2>Campaigns I Run</h2>
              <ListGroup>
                {this.props.campaigns.dmCampaigns.map((campaign) =>
                  <ListGroup.Item key={campaign.slug}>
                    <Link to={`/app/campaigns/${campaign.slug}`}>
                      {campaign.name}
                    </Link>
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
          ) : null}
        </div>
      </PageContainer>
    );
  }
}

Campaigns.propTypes = {
  campaigns: PropTypes.object,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    user: state.users.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    getCampaigns: () => {
      dispatch(rest.actions.getCampaigns());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Campaigns);