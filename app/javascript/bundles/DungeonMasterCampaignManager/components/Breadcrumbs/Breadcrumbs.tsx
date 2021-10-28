import React from 'react';
import BreadcrumbLink from './BreadcrumbLink';
import { navigate, WindowLocation } from '@reach/router';
import { GiPointing } from 'react-icons/all';

const styles = require('./breadcrumbs.module.scss');

export type BreadCrumbProps = {
  isActive?: boolean;
  title: string;
  url?: string;
};

const pathToTitle = (pathName: string): string => {
  const capitalize = (str: string) =>
    str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
  const escape = (str) => str.replace(/./g, (c) => `\\${c}`);
  const newName = pathName.replace(
    new RegExp(`[^${escape(' _-/')}]+`, 'g'),
    capitalize
  );
  return newName.replace('-', ' ');
};

const Breadcrumbs = (props: { location: WindowLocation }) => {
  const { location } = props;
  const [paths, setPaths] = React.useState<{ url: string; title: string }[]>(
    []
  );

  React.useEffect(() => {
    const pathNames = location.pathname
      .split('/')
      .filter((item) => item !== '' && item !== 'app');

    setPaths(
      pathNames.map((pathName, index) => {
        if (index === 0) {
          return { url: `/app/${pathName}`, title: pathToTitle(pathName) };
        }
        return {
          url: `/app/${pathNames.slice(0, index + 1).join('/')}`,
          title: pathToTitle(pathName),
        };
      })
    );
  }, [location]);

  return (
    <nav aria-label="breadcrumb">
      <ol className={styles.breadcrumb}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <GiPointing size={25} />
        </button>
        <BreadcrumbLink to="/" title={'Home'} />
        {paths.map((path, index) =>
          index === paths.length - 1 || path.title === 'Sections' ? (
            <li className={`${styles.breadcrumbItem} active`} key={index}>
              {path.title}
            </li>
          ) : (
            <BreadcrumbLink to={path.url} title={path.title} key={index} />
          )
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
