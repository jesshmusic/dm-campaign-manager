/**
 * Styled components for Footer
 * Migrated from footer.module.scss
 */

import styled from 'styled-components';
import { adjustLightness, respondTo } from '../../theme/mixins';

export const FooterWrapper = styled.div`
  background-color: ${({ theme }) => theme.colors.darkRed};
  border-top: 0.25rem solid ${({ theme }) => theme.colors.orange};
  color: ${({ theme }) => theme.colors.white};
  padding: 1rem 2rem 1rem 6rem;
  position: relative;
`;

export const BackgroundImage = styled.img`
  height: 100%;
  left: 0;
  object-fit: cover;
  object-position: top;
  opacity: 0.1;
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 100;
`;

export const Content = styled.div`
  position: relative;
  z-index: 101;

  ${respondTo.md`
    display: flex;
    padding: 1rem 2rem 1rem 22rem;
  `}
`;

export const Left = styled.div`
  flex: 1;
`;

export const Center = styled.div`
  align-items: flex-start;
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-start;
  padding: 0 2rem;
`;

export const Right = styled.div`
  flex: 0 0 16rem;
`;

export const Nav = styled.ul`
  display: block;
  list-style: none;
  text-align: right;
`;

export const PatreonBanner = styled.a`
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  display: block;
  overflow: hidden;
  position: relative;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
    transform: scale(1.02);
  }
`;

export const PatreonImage = styled.img`
  display: block;
  max-height: 10rem;
  width: auto;
`;

export const PatreonText = styled.span`
  bottom: 0;
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 1.1rem;
  font-weight: 600;
  justify-content: center;
  left: 0;
  padding: 0.5rem 1rem;
  position: absolute;
  right: 0;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.9);
`;

export const FooterLink = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  padding: 0.5rem 1rem;

  &:hover {
    color: ${({ theme }) => adjustLightness(theme.colors.primary, 40)};
  }
`;

export const SiteTitle = styled.h3`
  color: ${({ theme }) => adjustLightness(theme.colors.danger, 40)};
  text-shadow: 1px 1px ${({ theme }) => theme.colors.black};
`;

export const Logo = styled.img`
  max-height: 12rem;
`;
