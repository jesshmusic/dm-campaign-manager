/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import CampaignCard from './CampaignCard';

const CampaignsList = ({campaigns, user}) => {
  const campaignsList = campaigns.sort((campaign1, campaign2) => {
    if (campaign1.isDmCampaign && !campaign2.isDmCampaign) {
      return -1;
    }
    if (!campaign1.isDmCampaign && campaign2.isDmCampaign) {
      return 1;
    }
    if (campaign1.id > campaign2.id) {
      return 1;
    }
    if (campaign1.id < campaign2.id) {
      return -1;
    }
  });

  return campaignsList.map((campaign) => <CampaignCard campaign={campaign}
                                                       key={campaign.slug}
                                                       userName={user.name}/>);
};

CampaignsList.propTypes = {
  campaigns: PropTypes.array.isRequired,
};

export default CampaignsList;