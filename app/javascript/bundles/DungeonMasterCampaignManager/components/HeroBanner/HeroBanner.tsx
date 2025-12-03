import React from 'react';
import DndLogo from './DMLogo';

import { HeroBannerWrapper, Logo, Title } from './HeroBanner.styles';

const HeroBanner = () => {
  return (
    <HeroBannerWrapper>
      <Logo>
        <DndLogo />
      </Logo>
      <Title>Dungeon Master GURU</Title>
    </HeroBannerWrapper>
  );
};

export default HeroBanner;
