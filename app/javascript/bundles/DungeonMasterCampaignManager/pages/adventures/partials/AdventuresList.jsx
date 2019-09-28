/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import AdventureCard from './AdventureCard';
import AdventureForm from './AdventureForm';
import VirtualList from 'react-tiny-virtual-list';

const adventureItemsRendered = ({startIndex, stopIndex}) => {
  console.log(`startIndex: ${startIndex} stopIndex: ${stopIndex}`);
};

const adventuresScrolled = ({scrollTop, event}) => {
  console.log(`scrollTop: ${scrollTop}`);
};

const AdventuresList = ({
  campaign,
  deleteAdventure,
  onUpdateAdventure,
  small,
}) => (
  <VirtualList
    height={800}
    renderItem={({index, style}) =>
      <AdventureCard adventure={campaign.adventures[index]}
                     campaign={campaign}
                     deleteAdventure={deleteAdventure}
                     updateAdventure={onUpdateAdventure}
                     key={index}
                     small={small}
                     style={style}
      />
    }
    onItemsRendered={adventureItemsRendered}
    onScroll={adventuresScrolled}
    itemCount={campaign.adventures.length}
    itemSize={272}/>
);

AdventuresList.propTypes = {
  campaign: PropTypes.object.isRequired,
  deleteAdventure: PropTypes.func.isRequired,
  onUpdateAdventure: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

export default AdventuresList;