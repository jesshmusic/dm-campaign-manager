import React from 'react';
import classNames from 'classnames';
import { Colors } from '../../utilities/enums';

const styles = require('./button.module.scss');

const Button = (props: {
  id?: string;
  dataBsDismiss?: string;
  disabled?: boolean;
  color: Colors;
  title: string;
  onClick?: (event: any) => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  icon?: React.ReactNode;
  style?: object;
  hideTitle?: boolean;
}) => {
  const {
    id,
    icon,
    color,
    dataBsDismiss,
    style,
    disabled,
    hideTitle,
    title,
    onClick,
    type,
  } = props;

  return (
    <button
      className={classNames(styles.button, {
        [styles.primary]: color === Colors.primary,
        [styles.secondary]: color === Colors.secondary,
        [styles.success]: color === Colors.success,
        [styles.primaryDark]: color === Colors.primaryDark,
        [styles.info]: color === Colors.info,
        [styles.warning]: color === Colors.warning,
        [styles.danger]: color === Colors.danger,
        [styles.light]: color === Colors.light,
        [styles.dark]: color === Colors.dark,
      })}
      onClick={onClick}
      id={id}
      data-bs-dismiss={dataBsDismiss}
      disabled={disabled}
      style={style}
      type={type || 'button'}
    >
      {hideTitle ? '' : title}
      {icon && <> {icon}</>}
    </button>
  );
};

export default Button;
