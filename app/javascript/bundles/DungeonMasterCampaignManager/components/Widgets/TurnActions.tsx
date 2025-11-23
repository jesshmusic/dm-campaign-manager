import React from 'react';

import styles from './widgets.module.scss';

const TurnActions = () => {
  return (
    <div className={styles.content}>
      <ul>
        <li>Move up to your speed</li>
        <li>Take one action</li>
        <li>Communicate with speech, gesture, or both</li>
        <li>Interact with one object as you move or take your action</li>
      </ul>
    </div>
  );
};

export default TurnActions;
