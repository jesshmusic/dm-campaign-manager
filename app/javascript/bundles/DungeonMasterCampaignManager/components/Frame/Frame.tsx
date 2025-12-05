import React from 'react';
import { Link } from 'react-router-dom';

import { FrameWrapper, FrameBody, FrameTitle, FrameSubtitle } from './Frame.styles';

const Frame = (props: {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  style?: object;
  actionButton?: React.ReactNode;
  linkTo?: string;
}) => {
  const { title, subtitle, className, children, style, actionButton, icon, linkTo } = props;
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
        {subtitle && <FrameSubtitle>{subtitle}</FrameSubtitle>}
        {children}
      </FrameBody>
    </FrameWrapper>
  );
};

export default Frame;
