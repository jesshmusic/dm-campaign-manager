/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import EncounterCard from './EncounterCard';

const EncountersList = ({adventure, campaign, small}) => (
  adventure.encounters.map((encounter) =>
    <EncounterCard adventure={adventure}
                   campaign={campaign}
                   encounter={encounter}
                   key={encounter.id}
                   small={small}/>
  )
);

EncountersList.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  small: PropTypes.bool,
};

export default EncountersList;