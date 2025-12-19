import React from 'react';
import { NavLink } from '../NavLink/NavLink';
import DndLogo from '../HeroBanner/DMLogo';
import { User } from '@auth0/auth0-react';
import { useSidebar } from '../../contexts/SidebarContext';

import footerBg from './FooterBackground.jpg';
import patreonBanner from './PatreonBanner.png';

import {
  FooterWrapper,
  BackgroundImage,
  Content,
  Left,
  Center,
  Right,
  Nav,
  PatreonBanner,
  PatreonImage,
  PatreonText,
  FooterLink,
  SiteTitle,
  Logo,
} from './Footer.styles';

const PATREON_URL =
  'https://patreon.com/DormanLakely?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink';

const Footer = (_props: { user?: User }) => {
  const { sidebarWidth } = useSidebar();
  return (
    <FooterWrapper $sidebarWidth={sidebarWidth}>
      <BackgroundImage src={footerBg} alt="" />
      <Content>
        <Left>
          <SiteTitle>Dungeon Master GURU</SiteTitle>
          <Logo as={DndLogo} />
        </Left>
        <Center>
          <PatreonBanner href={PATREON_URL} target="_blank" rel="noopener noreferrer">
            <PatreonImage src={patreonBanner} alt="Become a Patron" />
            <PatreonText>Become a Patron</PatreonText>
          </PatreonBanner>
        </Center>
        <Right>
          <Nav>
            <NavLink to={'/'}>
              <FooterLink>Home</FooterLink>
            </NavLink>
            <NavLink to={'/app/classes'}>
              <FooterLink>Classes</FooterLink>
            </NavLink>
            <NavLink to={'/app/races'}>
              <FooterLink>Races</FooterLink>
            </NavLink>
            <NavLink to={'/app/monsters'}>
              <FooterLink>Monsters</FooterLink>
            </NavLink>
            <NavLink to={'/app/items'}>
              <FooterLink>Items and Equipment</FooterLink>
            </NavLink>
            <NavLink to={'/app/spells'}>
              <FooterLink>Spells</FooterLink>
            </NavLink>
          </Nav>
        </Right>
      </Content>
    </FooterWrapper>
  );
};

export default Footer;
