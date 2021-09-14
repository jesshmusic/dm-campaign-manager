import React from 'react';
import PropTypes from 'prop-types';

// Container
import {connect} from 'react-redux';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import NameField from '../../components/NameField';
import {Link} from '@reach/router';
import Col from 'react-bootstrap/Col';
import TavernNameField from '../../components/TavernNameField';

const HomePage = (props) => (
  <PageContainer user={ props.user }
                 flashMessages={ props.flashMessages }
                 pageTitle={ props.user ? 'Dashboard' : 'Welcome' }
                 description={ 'Dungeon Master\'s Toolbox is a free resource for DMs for reference that includes tools for smooth games.' }
                 breadcrumbs={ [] }>
    <Container>
      <PageTitle title={ 'Dungeon Master\'s Toolbox' } className={ 'home' }/>
      <Row className={ 'mb-5' }>
        <Col>
          <Link to={ '/app/npc-generator' } className={ 'btn btn-primary btn-lg btn-block' }>Generate NPC</Link>
        </Col>
      </Row>
      <Row className={ 'mb-5' }>
        <Col>
          <NameField colWidth={ '12' }/>
        </Col>
      </Row>
      <Row className={ 'mb-5' }>
        <Col>
          <TavernNameField colWidth={ '12' }/>
        </Col>
      </Row>
    </Container>
  </PageContainer>
);

export default HomePage;

// HomePage.propTypes = {
//   flashMessages: PropTypes.array,
//   itemsCount: PropTypes.number.isRequired,
//   npcsCount: PropTypes.number.isRequired,
//   spellsCount: PropTypes.number.isRequired,
//   user: PropTypes.object,
// };
//
// function mapStateToProps (state) {
//   return {
//     flashMessages: state.flashMessages,
//     itemsCount: state.items.count,
//     npcsCount: state.npcs.count,
//     spellsCount: state.spells.count,
//   };
// }
//
// export default connect(mapStateToProps)(HomePage);
