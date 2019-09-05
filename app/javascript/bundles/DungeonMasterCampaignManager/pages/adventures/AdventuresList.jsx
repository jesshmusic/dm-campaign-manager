/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import AdventureCard from './AdventureCard';

const AdventuresList = ({adventures, small}) => (
  adventures.map((adventure) =>
    <AdventureCard adventure={adventure} key={adventure.id} small={small}/>
  )
);

AdventuresList.propTypes = {
  adventures: PropTypes.array.isRequired,
  small: PropTypes.bool,
};

export default AdventuresList;