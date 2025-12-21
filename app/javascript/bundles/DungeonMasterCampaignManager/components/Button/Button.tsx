import React from 'react';
import { Colors } from '../../utilities/enums';

import { StyledButton, ButtonColor } from './Button.styles';

const colorMap: Record<Colors, ButtonColor> = {
  [Colors.primary]: 'primary',
  [Colors.secondary]: 'secondary',
  [Colors.success]: 'success',
  [Colors.primaryDark]: 'primaryDark',
  [Colors.info]: 'info',
  [Colors.warning]: 'warning',
  [Colors.danger]: 'danger',
  [Colors.light]: 'light',
  [Colors.dark]: 'dark',
  [Colors.transparent]: 'transparent',
  [Colors.transparentLight]: 'transparentLight',
};

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
  isLoading?: boolean;
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
    isLoading,
    onClick,
    style,
    title,
    type,
  } = props;

  return (
    <StyledButton
      className={className}
      $color={colorMap[color]}
      $isFullWidth={isFullWidth}
      $iconOnly={hideTitle}
      $isLoading={isLoading}
      onClick={onClick}
      id={id}
      data-bs-dismiss={dataBsDismiss}
      disabled={(disabled ?? false) || (isLoading ?? false)}
      style={style}
      type={type ?? 'button'}
    >
      {hideTitle ? '' : title}
      {icon && <span> {icon}</span>}
    </StyledButton>
  );
};

export default Button;
