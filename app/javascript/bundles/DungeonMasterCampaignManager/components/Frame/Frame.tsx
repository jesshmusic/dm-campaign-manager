import React from 'react';
import { Link } from 'react-router-dom';

import {
  FrameWrapper,
  FrameBody,
  FrameTitle,
  FrameSubtitle,
  FrameSubtitleWrapper,
} from './Frame.styles';

const Frame = (props: {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  subtitleAction?: React.ReactNode;
  children: React.ReactNode;
  style?: object;
  actionButton?: React.ReactNode;
  linkTo?: string;
}) => {
  const {
    title,
    subtitle,
    subtitleAction,
    className,
    children,
    style,
    actionButton,
    icon,
    linkTo,
  } = props;
  return (
    <FrameWrapper className={className} style={style}>
      <FrameBody>
        {(title || icon || actionButton || linkTo) && (
          <FrameTitle>
            {linkTo ? (
              <Link to={linkTo}>
                {icon}
                {icon && title && <>&nbsp;</>}
                {title || linkTo}
              </Link>
            ) : (
              <span>
                {icon}
                {icon && title && <>&nbsp;</>}
                {title}
              </span>
            )}
            {actionButton && <>&nbsp;{actionButton}</>}
          </FrameTitle>
        )}
        {(subtitle || subtitleAction) && (
          <FrameSubtitleWrapper>
            {subtitle && <FrameSubtitle>{subtitle}</FrameSubtitle>}
            {subtitleAction}
          </FrameSubtitleWrapper>
        )}
        {children}
      </FrameBody>
    </FrameWrapper>
  );
};

export default Frame;
