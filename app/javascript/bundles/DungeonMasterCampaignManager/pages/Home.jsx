import PropTypes from 'prop-types';
import React from 'react';

import axiosClient from '../actions/axiosClient';

// Container
import PageContainer from '../containers/PageContainer.jsx';

import styles from './Home.scss';

export default class Home extends React.Component {

  render() {
    return (
      <PageContainer user={this.props.user}>
        <div className={styles.container}>
          <h1>
            D&D Campaign Manager
          </h1>
        </div>
      </PageContainer>
    );
  }
}
