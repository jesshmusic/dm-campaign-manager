/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import CampaignCard from './CampaignCard';

const CampaignsList = ({campaigns}) => (
  campaigns.map((campaign) =>
    <CampaignCard campaign={campaign} key={campaign.slug}/>
  )
);

CampaignsList.propTypes = {
  campaigns: PropTypes.array.isRequired
};

export default CampaignsList;