import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// Container
import PageContainer from '../containers/PageContainer.jsx';

import styles from './home.module.scss';

class HomePage extends React.Component {

  render () {

    return (
      <PageContainer user={this.props.user} flashMessages={this.props.flashMessages}>
        <div>
          <div className="row">
            <div className="col">
              <h1>DM Campaign Manager</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h2>{this.props.campaigns.title}</h2>
              <ul className="list-group list-group-flush">
                {this.props.campaigns.campaigns.map((campaign, index) => <li key={index} className="list-group-item">{campaign.name}</li>)}
              </ul>
            </div>
            <div className="col">
              <h3>{this.props.dungeonMasters.title}</h3>
              <ul className="list-group list-group-flush">
                {this.props.dungeonMasters.dungeonMasters.map((dm, index) => <li key={index} className="list-group-item">{dm.name}</li>)}
              </ul>
              { this.props.playerCharacters ? (
                <div>
                  <h3>{this.props.playerCharacters.title}</h3>
                  <ul className="list-group list-group-flush">
                    {this.props.playerCharacters.characters.map((character, index) => <li key={index} className="list-group-item">{character.name}</li>)}
                  </ul>
                </div>
              ) : null}
              { this.props.nonPlayerCharacters ? (
                <div>
                  <h3>{this.props.nonPlayerCharacters.title}</h3>
                  <ul className="list-group list-group-flush">
                    {this.props.nonPlayerCharacters.characters.map((character, index) => <li key={index} className="list-group-item">{character.name}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
}

HomePage.propTypes = {
  campaigns: PropTypes.object,
  nonPlayerCharacters: PropTypes.object,
  playerCharacters: PropTypes.object,
  dungeonMasters: PropTypes.object,
  user: PropTypes.object,
  flashMessages: PropTypes.array,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    nonPlayerCharacters: state.nonPlayerCharacters,
    playerCharacters: state.playerCharacters,
    dungeonMasters: state.dungeonMasters,
    user: state.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
