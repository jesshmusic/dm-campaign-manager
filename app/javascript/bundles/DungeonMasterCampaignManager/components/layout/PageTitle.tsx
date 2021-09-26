/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Link } from '@reach/router';

type PageTitleProps = {
  className?: string;
  hasButton?: boolean;
  buttonLink?: string;
  buttonTitle?: string;
  buttonVariant?: string;
  subtitle?: string;
  title: string;
}

const PageTitle = (props: PageTitleProps) => {
  const { className, hasButton, buttonLink, buttonTitle, buttonVariant, subtitle, title } = props;
  return (
    <Row>
      <Col>
        <h1 className={`d-flex justify-content-between align-items-center ${className}`}>
          {title}
          {hasButton && buttonLink ? (
            <Link to={buttonLink} className={`btn btn-${buttonVariant}`}>
              {buttonTitle}
            </Link>
          ) : null}
        </h1>
        {subtitle ? (
          <p className={'h5 text-muted'}>{subtitle}</p>
        ) : null}
      </Col>
    </Row>
  );
};

export default PageTitle;