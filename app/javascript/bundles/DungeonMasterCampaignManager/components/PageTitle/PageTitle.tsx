/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';

import styles from './page-title.module.scss';

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
    <div className={styles.pageTitle}>
      <h1
        className={classNames({
          [styles.draconis]: isDraconis,
        })}
      >
        {title}
        {hasButton && buttonLink ? (
          <Link to={buttonLink} className={`btn btn-${buttonVariant}`}>
            {buttonTitle}
          </Link>
        ) : null}
      </h1>
      {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
    </div>
  );
};

export default PageTitle;
