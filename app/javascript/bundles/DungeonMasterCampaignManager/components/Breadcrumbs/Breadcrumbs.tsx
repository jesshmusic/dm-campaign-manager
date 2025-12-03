import React from 'react';
import BreadcrumbLink from './BreadcrumbLink';
import { GiCastle, GiPointing, GiTwoHandedSword } from 'react-icons/gi';
import { useLocation, useNavigate } from 'react-router-dom';

import { BackButton, HomeIcon, BreadcrumbList, BreadcrumbItem } from './Breadcrumbs.styles';

export type BreadCrumbProps = {
  isActive?: boolean;
  title: string;
  url?: string;
};

const pathToTitle = (pathName: string): string => {
  const capitalize = (str: string) =>
    str.length ? str[0].toUpperCase() + str.slice(1).toLowerCase() : '';
  const escape = (str: string) => str.replace(/./g, (c) => `\\${c}`);
  const newName = pathName.replace(new RegExp(`[^${escape(' _-/')}]+`, 'g'), capitalize);
  return newName.replace('-', ' ');
};

/** Items that should not be clickable (parent categories without their own page) */
const NON_CLICKABLE_TITLES = ['Sections', 'Rules'];

/** Checks if a breadcrumb item should be rendered as non-clickable */
const isNonClickable = (title: string, index: number, totalPaths: number): boolean =>
  index === totalPaths - 1 || NON_CLICKABLE_TITLES.includes(title);

/** Checks if a breadcrumb item is the active (current) page */
const isActivePage = (index: number, totalPaths: number): boolean => index === totalPaths - 1;

const Breadcrumbs = (props: { isCollapsed: boolean }) => {
  const { isCollapsed } = props;
  const location = useLocation();
  const navigate = useNavigate();
  const [paths, setPaths] = React.useState<{ url: string; title: string }[]>([]);

  React.useEffect(() => {
    const pathNames = location.pathname.split('/').filter((item) => item !== '' && item !== 'app');

    setPaths(
      pathNames.map((pathName, index) => {
        if (index === 0) {
          return { url: `/app/${pathName}`, title: pathToTitle(pathName) };
        }
        return {
          url: `/app/${pathNames.slice(0, index + 1).join('/')}`,
          title: pathToTitle(pathName),
        };
      }),
    );
  }, [location]);

  return (
    <nav aria-label="breadcrumb">
      <BreadcrumbList $isCollapsed={isCollapsed}>
        {paths.length > 0 ? (
          <BackButton onClick={() => navigate(-1)}>
            <GiPointing size={25} />
          </BackButton>
        ) : (
          <HomeIcon>
            <GiCastle size={25} />
          </HomeIcon>
        )}

        <BreadcrumbLink to="/" title={'Home'} />
        {paths.map((path, index) =>
          isNonClickable(path.title, index, paths.length) ? (
            <BreadcrumbItem $isActive={isActivePage(index, paths.length)} key={index}>
              <GiTwoHandedSword /> {path.title}
            </BreadcrumbItem>
          ) : (
            <BreadcrumbLink to={path.url} title={path.title} key={index} />
          ),
        )}
      </BreadcrumbList>
    </nav>
  );
};

export default Breadcrumbs;
