import React from 'react';
import BreadcrumbLink from './BreadcrumbLink';
import { GiCastle, GiPointing, GiTwoHandedSword } from 'react-icons/gi';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSidebar } from '../../contexts/SidebarContext';

import {
  BackButton,
  HomeIcon,
  BreadcrumbList,
  BreadcrumbItem as StyledBreadcrumbItem,
} from './Breadcrumbs.styles';

export type BreadcrumbPathItem = {
  title: string;
  url: string;
};

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
const NON_CLICKABLE_TITLES = ['Sections'];

/** Checks if a breadcrumb item should be rendered as non-clickable */
const isNonClickable = (title: string, index: number, totalPaths: number): boolean =>
  index === totalPaths - 1 || NON_CLICKABLE_TITLES.includes(title);

/** Checks if a breadcrumb item is the active (current) page */
const isActivePage = (index: number, totalPaths: number): boolean => index === totalPaths - 1;

type BreadcrumbsProps = {
  customPaths?: BreadcrumbPathItem[];
};

const Breadcrumbs = ({ customPaths }: BreadcrumbsProps) => {
  const { sidebarWidth } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const [paths, setPaths] = React.useState<{ url: string; title: string }[]>([]);

  React.useEffect(() => {
    // Use custom paths if provided, otherwise derive from URL
    if (customPaths && customPaths.length > 0) {
      setPaths(customPaths);
      return;
    }

    const pathNames = location.pathname
      .split('/')
      .filter((item: any) => item !== '' && item !== 'app');

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
  }, [location, customPaths]);

  return (
    <nav aria-label="breadcrumb">
      <BreadcrumbList $sidebarWidth={sidebarWidth}>
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
            <StyledBreadcrumbItem $isActive={isActivePage(index, paths.length)} key={index}>
              <GiTwoHandedSword /> {path.title}
            </StyledBreadcrumbItem>
          ) : (
            <BreadcrumbLink to={path.url} title={path.title} key={index} />
          ),
        )}
      </BreadcrumbList>
    </nav>
  );
};

export default Breadcrumbs;
