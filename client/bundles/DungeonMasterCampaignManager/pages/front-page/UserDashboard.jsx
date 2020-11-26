import React from 'react';
import PropTypes from 'prop-types';

// Container
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class UserDashboard extends React.Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    // this.props.getCampaigns(this.props.user.id);
  }

  render () {
    const {user} = this.props;
    return (
      <Col sm={8}>
        <Row>
          Welcome {user.name}
        </Row>
      </Col>
    );
  }
}

UserDashboard.propTypes = {
  user: PropTypes.object,
};

export default UserDashboard;
