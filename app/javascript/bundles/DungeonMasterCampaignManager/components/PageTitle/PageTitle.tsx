/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import { Link } from 'react-router-dom';

import { PageTitleWrapper, Title, Subtitle } from './PageTitle.styles';

type PageTitleProps = {
  isDraconis?: boolean;
  hasButton?: boolean;
  buttonLink?: string;
  buttonTitle?: string;
  buttonVariant?: string;
  subtitle?: string;
  title: string;
};

const PageTitle = (props: PageTitleProps) => {
  const { isDraconis, hasButton, buttonLink, buttonTitle, buttonVariant, subtitle, title } = props;
  return (
    <PageTitleWrapper>
      <Title $isDraconis={isDraconis}>
        {title}
        {hasButton && buttonLink ? (
          <Link to={buttonLink} className={`btn btn-${buttonVariant}`}>
            {buttonTitle}
          </Link>
        ) : null}
      </Title>
      {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
    </PageTitleWrapper>
  );
};

export default PageTitle;
