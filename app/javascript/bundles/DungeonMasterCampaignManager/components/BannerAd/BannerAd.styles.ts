/**
 * Styled components for BannerAd
 * Migrated from bannerad.module.scss
 */

import styled, { css } from 'styled-components';
import { respondTo } from '../../theme/mixins';

export const BannerAdContainer = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 0 1rem;
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
