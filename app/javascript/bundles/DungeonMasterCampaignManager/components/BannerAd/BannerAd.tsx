import ReactGA from 'react-ga4';
import { useSidebar } from '../../contexts/SidebarContext';

ReactGA.initialize('G-8XJTH70JSQ');

import { BannerAdContainer, BannerImageLarge, BannerImageSmall } from './BannerAd.styles';

const BannerAd = () => {
  const { sidebarWidth } = useSidebar();
  const handleClick = () => {
    ReactGA.event('Banner Ad Clicked');
  };
  return (
    <BannerAdContainer $sidebarWidth={sidebarWidth}>
      <a
        href="https://affiliates.fantasygrounds.com/324247/15958/banner_7297"
        target="_blank"
        style={{ textDecoration: 'none' }}
        onClick={handleClick}
        rel="noreferrer"
      >
        <img
          src="https://affiliates.fantasygrounds.com/banner_image/banner/id:7297_324247_15958"
          height="0"
          width="0"
        />
        <BannerImageLarge src="https://affiliates.fantasygrounds.com/img/banners/316034_2156040637.jpg" />
        <BannerImageSmall src="https://affiliates.fantasygrounds.com/img/banners/316034_2966475059.jpg" />
      </a>
    </BannerAdContainer>
  );
};

export default BannerAd;
