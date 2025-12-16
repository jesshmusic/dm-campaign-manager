/**
 * Styled components for BannerAd
 * Migrated from bannerad.module.scss
 */

import styled, { css } from 'styled-components';
import { respondTo, respondToContainer } from '../../theme/mixins';

export const BannerAdContainer = styled.div<{ $isCollapsed?: boolean }>`
  display: flex;
  justify-content: center;
  padding: 0 0 1rem;
  padding-left: 5rem;

  ${respondToContainer.md`
    padding-left: 15rem;
  `}

  ${({ $isCollapsed }) =>
    $isCollapsed &&
    `
    padding-left: 5rem;
  `}
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
