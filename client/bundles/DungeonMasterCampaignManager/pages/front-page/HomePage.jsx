import React from 'react';
import PropTypes from 'prop-types';

// Container
import WelcomePage from './WelcomePage';
import {connect} from 'react-redux';
import Row from 'react-bootstrap/Row';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import InfoBox from '../../components/layout/InfoBox';

const HomePage = (props) => (
  <PageContainer user={props.user}
                 flashMessages={props.flashMessages}
                 pageTitle={props.user ? 'Dashboard' : 'Welcome'}
                 description={'Dungeon Master\'s Toolbox is a free resource for DMs for reference that includes tools for smooth games.'}
                 breadcrumbs={[]}>
    <div>
      <PageTitle title={'Dungeon Master\'s Toolbox'}/>
      <Row>
        <WelcomePage />
        <InfoBox {...props}/>
      </Row>
    </div>
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
