import { Link } from 'react-router-dom';
import { GiBarbute } from 'react-icons/all';
import React from 'react';

const styles = require('../../pages/user-dashboard/user-dashboard.module.scss');

const NPCGenButton = () => (
  <Link to="/app/monster-generator" className={styles.buttonBar}>
    <GiBarbute size={24} /> NPC Generators
  </Link>
);

export default NPCGenButton;
