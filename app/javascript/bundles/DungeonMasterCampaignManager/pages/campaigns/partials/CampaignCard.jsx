/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import { Link } from '@reach/router';
import ReactMarkdown from 'react-markdown';
import Col from 'react-bootstrap/Col';

const CampaignCard = ({campaign}) => (
  <Card>
    <Card.Header>
      <Card.Title>{campaign.name}</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">World: {campaign.world}</Card.Subtitle>
    </Card.Header>
    <Card.Body>
      <ReactMarkdown source={campaign.description} />
    </Card.Body>
    <Card.Footer>
      <Link to={`/app/campaigns/${campaign.slug}`} className='btn btn-primary'>Details</Link>
    </Card.Footer>
  </Card>
);

CampaignCard.propTypes = {
  campaign: PropTypes.object.isRequired
};

export default CampaignCard;