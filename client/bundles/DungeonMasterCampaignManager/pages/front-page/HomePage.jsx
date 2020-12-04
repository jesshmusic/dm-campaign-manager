import React from 'react';
import PropTypes from 'prop-types';

// Container
import WelcomePage from './WelcomePage';
import {connect} from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
// import InfoBox from '../../components/layout/InfoBox';
import NameField from '../npcs/partials/NameField';
import {Link} from '@reach/router';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import {Form} from 'react-bootstrap';

const HomePage = (props) => (
  <PageContainer user={props.user}
                 flashMessages={props.flashMessages}
                 pageTitle={props.user ? 'Dashboard' : 'Welcome'}
                 description={'Dungeon Master\'s Toolbox is a free resource for DMs for reference that includes tools for smooth games.'}
                 breadcrumbs={[]}>
    <Container>
      <PageTitle title={'Dungeon Master\'s Toolbox'}/>
      <Row className={'mb-5'}>
        <Col>
          <Link to={'/app/npc-generator'} className={'btn btn-primary btn-lg btn-block'}>Generate NPC</Link>
        </Col>
      </Row>
      <Row className={'mb-5'}>
        <Col>
          <Card className={'shadow mb-5'}>
            <Card.Body>
              <Card.Title>Random Character Name</Card.Title>
              <Card.Subtitle>Generate a random fantasy name based on gender and race</Card.Subtitle>
              <NameField colWidth={'12'}/>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  </PageContainer>
);

HomePage.propTypes = {
  flashMessages: PropTypes.array,
  itemsCount: PropTypes.number.isRequired,
  npcsCount: PropTypes.number.isRequired,
  spellsCount: PropTypes.number.isRequired,
  user: PropTypes.object,
};

function mapStateToProps (state) {
  return {
    flashMessages: state.flashMessages,
    itemsCount: state.items.count,
    npcsCount: state.npcs.count,
    spellsCount: state.spells.count,
  };
}

export default connect(mapStateToProps)(HomePage);
