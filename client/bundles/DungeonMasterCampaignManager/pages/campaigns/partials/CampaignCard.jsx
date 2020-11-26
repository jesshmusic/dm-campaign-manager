/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import { Link } from '@reach/router';

import classes from './campaign-card.module.scss';
import Badge from 'react-bootstrap/Badge';

const CampaignCard = ({campaign, userName}) => (
  <Card className={classes.campaignCard}>
    <Card.Header>
      <Card.Title>{campaign.name}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted d-flex justify-content-between">
        World: {campaign.world}
        {!campaign.isDmCampaign ? (
          <Badge variant={'info'}>DM: {userName}</Badge>
        ) : null}
      </Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <Card.Text>
        {campaign.excerpt}
      </Card.Text>
    </Card.Body>
    <Card.Footer>
      <Link to={`/app/campaigns/${campaign.slug}`} className='btn btn-primary'>Details</Link>
      {campaign.isDmCampaign ? (
        <Link to={`/app/campaigns/${campaign.slug}/edit`} className='btn btn-info ml-2'>Edit</Link>
      ) : null}
    </Card.Footer>
  </Card>
);

CampaignCard.propTypes = {
  campaign: PropTypes.object.isRequired,
  userName: PropTypes.string.isRequired,
};

export default CampaignCard;