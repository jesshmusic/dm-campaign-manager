/**
 * Styled components for BannerAd
 * Migrated from bannerad.module.scss
 */

import styled, { css } from 'styled-components';
import { respondTo } from '../../theme/mixins';

export const BannerAdContainer = styled.div<{ $sidebarWidth?: number }>`
  display: flex;
  justify-content: center;
  padding: 0 0 1rem;
  padding-left: ${({ $sidebarWidth }) => $sidebarWidth ?? 80}px;
  transition: padding-left 0.15s ease-out;
`;

const bannerImageBase = css`
  height: auto;
  width: 100%;
`;

export const BannerImageSmall = styled.img`
  ${bannerImageBase}

  ${respondTo.md`
    display: none;
  `}
`;

export const BannerImageLarge = styled.img`
  ${bannerImageBase}
  display: none;

  ${respondTo.md`
    display: block;
  `}
`;
