import React from 'react';

const styles = require('../dnd-class.module.scss');

const InfoBlock = (props: { title: string; desc: string }) => (
  <div className={styles.infoBlock}>
    <span>{props.title}: </span>
    {props.desc}
  </div>
);

export default InfoBlock;
