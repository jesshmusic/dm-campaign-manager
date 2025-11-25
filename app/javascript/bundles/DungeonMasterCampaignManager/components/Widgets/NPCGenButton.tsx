import { Link } from 'react-router-dom';
import { GiBarbute } from 'react-icons/gi';
import React from 'react';

import styles from './widgets.module.scss';

const NPCGenButton = () => (
  <Link to="/app/monster-generator" className={styles.buttonBar}>
    <GiBarbute size={24} /> NPC Generators
  </Link>
);

export default NPCGenButton;
