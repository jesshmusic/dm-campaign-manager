import React from 'react';
import classNames from 'classnames';
import { Colors } from '../../utilities/enums';

import styles from './button.module.scss';

const Button = (props: {
  id?: string;
  dataBsDismiss?: string;
  disabled?: boolean;
  className?: string;
  color: Colors;
  title: string;
  onClick?: (event: unknown) => void;
  type?: 'button' | 'submit' | 'reset' | undefined;
  icon?: React.ReactNode;
  style?: object;
  hideTitle?: boolean;
  isFullWidth?: boolean;
}) => {
  const {
    className,
    color,
    dataBsDismiss,
    disabled,
    hideTitle,
    icon,
    id,
    isFullWidth,
    onClick,
    style,
    title,
    type,
  } = props;

  return (
    <button
      className={classNames(styles.button, className, {
        [styles.primary]: color === Colors.primary,
        [styles.secondary]: color === Colors.secondary,
        [styles.success]: color === Colors.success,
        [styles.primaryDark]: color === Colors.primaryDark,
        [styles.info]: color === Colors.info,
        [styles.warning]: color === Colors.warning,
        [styles.danger]: color === Colors.danger,
        [styles.light]: color === Colors.light,
        [styles.dark]: color === Colors.dark,
        [styles.transparent]: color === Colors.transparent,
        [styles.transparentLight]: color === Colors.transparentLight,
        [styles.fullWidth]: isFullWidth,
      })}
      onClick={onClick}
      id={id}
      data-bs-dismiss={dataBsDismiss}
      disabled={disabled}
      style={style}
      type={type || 'button'}
    >
      {hideTitle ? '' : title}
      {icon && <span className={classNames('', { [styles.iconOnly]: hideTitle })}> {icon}</span>}
    </button>
  );
};

export default Button;
