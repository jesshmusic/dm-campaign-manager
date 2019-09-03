import React from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Container
import PageContainer from '../../containers/PageContainer.jsx';

const WelcomePage = ({flashMessages}) => (
  <PageContainer user={null}
                 flashMessages={flashMessages}
                 pageTitle='Welcome'
                 description={'Dungeon Master\'s Campaign Manager is a free resource for DMs to manage their campaigns, adventures, and NPCs.'}>
    <Row>
      <Col>
        <p>
          The <strong>Dungeon Master&apos;s Campaign Manager</strong> is a tool for organizing and running a Campaign in D&D 5e.
          To be able to create, edit, and manage accounts just sign up for a free account.
        </p>
      </Col>
    </Row>
  </PageContainer>
);

WelcomePage.propTypes = {
  flashMessages: PropTypes.array,
};

export default WelcomePage;
