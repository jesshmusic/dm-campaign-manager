import React from 'react';
import PropTypes from 'prop-types';

// Container
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import CampaignsList from '../campaigns/partials/CampaignsList';

class UserDashboard extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    this.props.getCampaigns(this.props.user.id);
  }

  render () {
    const {campaigns} = this.props;
    return (
      <Col sm={8}>
        <Row>
          {campaigns ? (
            <Col>
              <h2>My Campaigns</h2>
              <CampaignsList campaigns={campaigns}/>
            </Col>
          ) : (
            <Col>
              <h2>My Campaigns</h2>
              <Alert>
                Click here to create a new campaign.
              </Alert>
            </Col>
          )}
        </Row>
      </Col>
    );
  }
}

UserDashboard.propTypes = {
  campaigns: PropTypes.array,
  getCampaigns: PropTypes.func.isRequired,
  user: PropTypes.object,
};

export default UserDashboard;
