import { Colors } from '../../utilities/enums';
import { GiCrossMark } from 'react-icons/all';
import Button from './Button';
import React from 'react';
const styles = require('./button.module.scss');

const CloseButton = (props: { onClick: () => void }) => {
  const { onClick } = props;

  return (
    <Button
      className={styles.closeButton}
      color={Colors.transparent}
      icon={<GiCrossMark />}
      hideTitle
      title="X"
      onClick={onClick}
    />
  );
};

export default CloseButton;
