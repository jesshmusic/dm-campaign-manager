/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import EncounterCard from './EncounterCard';

const EncountersList = ({adventure, campaign, handleUpdateCampaign, small}) => (
  adventure.encounters.map((encounter) =>
    <EncounterCard adventure={adventure}
                   campaign={campaign}
                   encounter={encounter}
                   updateCampaign={handleUpdateCampaign}
                   key={encounter.id}
                   small={small}/>
  )
);

EncountersList.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  handleUpdateCampaign: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

export default EncountersList;