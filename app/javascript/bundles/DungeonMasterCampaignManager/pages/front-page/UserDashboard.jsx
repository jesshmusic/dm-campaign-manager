import React from 'react';
import PropTypes from 'prop-types';

import ListGroup from 'react-bootstrap/ListGroup';

import { Link } from '@reach/router';

// Container
import PageContainer from '../../containers/PageContainer.jsx';

class UserDashboard extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaigns();
  }

  render () {
    const {campaigns, user, flashMessages} = this.props;
    return (
      <PageContainer user={user}
                     flashMessages={flashMessages}
                     pageTitle='Dashboard'
                     description={'Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}>
        <div>
          {user && campaigns.dmCampaigns ? (
            <div>
              <h2>My Campaigns</h2>
              <ListGroup>
                {campaigns.dmCampaigns.map((campaign) =>
                  <ListGroup.Item key={campaign.slug}>
                    <Link to={`/app/campaigns/${campaign.slug}`}>
                      {campaign.name} - {campaign.dungeonMaster.name}
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

UserDashboard.propTypes = {
  campaigns: PropTypes.object,
  flashMessages: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default UserDashboard;
