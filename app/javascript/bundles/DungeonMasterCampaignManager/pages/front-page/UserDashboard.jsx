import React from 'react';
import PropTypes from 'prop-types';

// Container
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import CampaignsList from '../campaigns/CampaignsList';

class UserDashboard extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaigns(this.props.user.id);
  }

  render () {
    const {campaigns, user} = this.props;
    return (
      user && campaigns.campaigns ? (
        <Col sm={8}>
          <h2>My Campaigns</h2>
          <CampaignsList campaigns={campaigns.campaigns}/>
        </Col>
      ) : (
        <Col>
          <h2>My Campaigns</h2>
          <Alert>
            Click here to create a new campaign.
          </Alert>
        </Col>
      )
    );
  }
}

UserDashboard.propTypes = {
  campaigns: PropTypes.object,
  getCampaigns: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default UserDashboard;
