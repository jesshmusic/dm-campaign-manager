/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import AdventureCard from './AdventureCard';

const AdventuresList = ({campaign, handleUpdateCampaign, small}) => (
  campaign.adventures.map((adventure) =>
    <AdventureCard adventure={adventure}
                   campaign={campaign}
                   updateCampaign={handleUpdateCampaign}
                   key={adventure.id}
                   small={small}/>
  )
);

AdventuresList.propTypes = {
  campaign: PropTypes.object.isRequired,
  handleUpdateCampaign: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

export default AdventuresList;