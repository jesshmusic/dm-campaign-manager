import PropTypes from 'prop-types';
import React from 'react';

import axiosClient from '../actions/axiosClient';

// Container
import PageContainer from '../containers/PageContainer.jsx';

import styles from './home.module.scss';

export default class Home extends React.Component {

  render() {
    return (
      <PageContainer user={this.props.user}>
        <div>
          <div className="row">
            <div className="col">
              <h1>D&D Campaign Manager</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h2>{this.props.campaigns.title}</h2>
              <ul className="list-group list-group-flush">
                {this.props.campaigns.campaigns.map((campaign, index) => {
                  return <li key={index} className="list-group-item">{campaign.name}</li>
                })}
              </ul>
            </div>
            <div className="col">
              <h3>{this.props.dungeonMasters.title}</h3>
              <ul className="list-group list-group-flush">
                {this.props.dungeonMasters.dungeonMasters.map((dm, index) => {
                  return <li key={index} className="list-group-item">{dm.name}</li>
                })}
              </ul>
              <h3>{this.props.characters.title}</h3>
              <ul className="list-group list-group-flush">
                {this.props.characters.characters.map((character, index) => {
                  return <li key={index} className="list-group-item">{character.name}</li>
                })}
              </ul>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
}
