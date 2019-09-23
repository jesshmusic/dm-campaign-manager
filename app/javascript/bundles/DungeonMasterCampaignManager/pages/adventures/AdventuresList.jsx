/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import AdventureCard from './AdventureCard';

const AdventuresList = ({adventures, editAdventure, small, stopEditAdventure}) => (
  adventures.map((adventure) =>
    <AdventureCard adventure={adventure}
                   editAdventure={editAdventure}
                   key={adventure.id}
                   small={small}
                   stopEditAdventure={stopEditAdventure}/>
  )
);

AdventuresList.propTypes = {
  adventures: PropTypes.array.isRequired,
  editAdventure: PropTypes.func.isRequired,
  small: PropTypes.bool,
  stopEditAdventure: PropTypes.func.isRequired,
};

export default AdventuresList;