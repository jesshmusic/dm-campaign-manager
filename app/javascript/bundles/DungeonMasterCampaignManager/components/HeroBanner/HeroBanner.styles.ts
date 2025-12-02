/**
 * Styled components for HeroBanner and DMLogo
 * Migrated from hero-banner.module.scss and dmlogo.module.scss
 */

import styled from 'styled-components';

// DMLogo styles
export const LogoSvg = styled.svg`
  clip-rule: evenodd;
  fill-rule: evenodd;
  stroke-linejoin: miter;
  stroke-miterlimit: 2;
`;

export const SwordsPath = styled.path`
  fill: ${({ theme }) => theme.colors.ash};
  fill-rule: nonzero;
  stroke: ${({ theme }) => theme.colors.gray100};
  stroke-width: 12px;
`;

export const ShieldPath = styled.path`
  fill: ${({ theme }) => theme.colors.darkRed};
  fill-rule: nonzero;
  stroke: ${({ theme }) => theme.colors.gray900};
  stroke-width: 10px;
`;

export const DndPath = styled.path`
  fill: ${({ theme }) => theme.colors.bloodRed};
  fill-rule: nonzero;
`;

// HeroBanner styles
export const HeroBannerWrapper = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.black};
  display: flex;
  height: 10rem;
  justify-content: space-between;
  overflow: hidden;
  padding: 1rem 2.5rem;
  position: relative;

  &::before {
    background: url('/images/hero-banner.jpg') no-repeat center;
    background-size: cover;
    bottom: 0;
    content: '';
    left: 0;
    opacity: 0.5;
    position: absolute;
    right: 0;
    top: 0;
    z-index: 0;
  }
`;

export const Logo = styled.div`
  margin-right: 1rem;
  z-index: 1;
`;

export const Title = styled.div`
  font-size: 3.5rem;
  font-family: ${({ theme }) => theme.fonts.draconis};
  letter-spacing: 0.02rem;
  -webkit-text-fill-color: ${({ theme }) => theme.colors.bloodRed};
  -webkit-text-stroke: 0.05rem ${({ theme }) => theme.colors.white};
  z-index: 1;
`;
