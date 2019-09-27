/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import AdventureCard from './AdventureCard';
import AdventureForm from './AdventureForm';

const AdventuresList = ({
  campaign,
  deleteAdventure,
  onUpdateAdventure,
  small,
}) => (
  campaign.adventures.map((adventure) =>
    <AdventureCard adventure={adventure}
                   campaign={campaign}
                   deleteAdventure={deleteAdventure}
                   updateAdventure={onUpdateAdventure}
                   key={adventure.id}
                   small={small}/>
  )
);

AdventuresList.propTypes = {
  campaign: PropTypes.object.isRequired,
  deleteAdventure: PropTypes.func.isRequired,
  onUpdateAdventure: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

export default AdventuresList;