/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import CampaignCard from './partials/CampaignCard';
import CardDeck from 'react-bootstrap/CardDeck';

const CampaignsList = ({campaigns}) => (
  <CardDeck>
    {campaigns.map((campaign) =>
      <CampaignCard campaign={campaign} key={campaign.slug}/>
    )}
  </CardDeck>
);

CampaignsList.propTypes = {
  campaigns: PropTypes.array.isRequired
};

export default CampaignsList;