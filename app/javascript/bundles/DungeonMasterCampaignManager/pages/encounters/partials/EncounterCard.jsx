/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import ReactMarkdown from 'react-markdown';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {Link} from '@reach/router';
import ListGroup from 'react-bootstrap/ListGroup';
import { sortableElement } from 'react-sortable-hoc';
import DragHandle from '../../../components/DragHandle';

const EncounterCard = ({adventure, encounter, campaign, small}) => {
  return small ? (
    <Card className={'mb-3'}>
      <Card.Body className={'d-flex justify-content-between'}>
        <DragHandle />
        <Link to={ `/app/campaigns/${campaign.slug}/adventures/${adventure.id}/encounters/${encounter.id}` }
              className={'ml-3 flex-grow-1'}>
          <p className={'h5 my-2'}>{encounter.name}
            <small className={'text-muted ml-3'}>
              { encounter.location }
              <span className={'ml-3'}>
                { adventure.pcs.length > 0 ? (
                  `${encounter.xp / adventure.pcs.length}xp per character`
                ) : (
                  `${encounter.xp}xp divided by number of party members`
                ) }
              </span>
            </small>
          </p>
        </Link>
        <Link to={ `/app/campaigns/${campaign.slug}/adventures/${adventure.id}/encounters/${encounter.id}/edit` }
              className={ 'btn btn-info float-sm-right' }>
          Edit
        </Link>
      </Card.Body>
    </Card>
  ) : (
    <Card className={ 'mb-3' }>
      <Card.Header>
        <Link to={ `/app/campaigns/${campaign.slug}/adventures/${adventure.id}/encounters/${encounter.id}` }>
          <h4 className={ 'my-2' }>{ encounter.name }</h4>
        </Link>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col>
            <h5 className={ 'mb-0' }>XP</h5>
            { adventure.pcs.length > 0 ? (
              `${encounter.xp / adventure.pcs.length}xp per character`
            ) : (
              `${encounter.xp}xp divided by number of party members`
            ) }
          </Col>
        </Row>
        <Row>
          <Col>
            <ReactMarkdown source={ encounter.description }/>
          </Col>
        </Row>
        <Row>
          <Col>
            <h5>Treasure</h5>
            <ListGroup variant="flush">
              { encounter.copperPieces && encounter.copperPieces > 0 ? (
                <ListGroup.Item>
                  <strong className={ 'text-muted' }>
                    Copper
                  </strong>&nbsp;&nbsp;{ encounter.copperPieces }
                </ListGroup.Item>
              ) : null }
              { encounter.silverPieces && encounter.silverPieces > 0 ? (
                <ListGroup.Item>
                  <strong className={ 'text-muted' }>
                    Silver
                  </strong>&nbsp;&nbsp;{ encounter.silverPieces }
                </ListGroup.Item>
              ) : null }
              { encounter.electrumPieces && encounter.electrumPieces > 0 ? (
                <ListGroup.Item>
                  <strong className={ 'text-muted' }>
                    Electrum
                  </strong>&nbsp;&nbsp;{ encounter.electrumPieces }
                </ListGroup.Item>
              ) : null }
              { encounter.goldPieces && encounter.goldPieces > 0 ? (
                <ListGroup.Item>
                  <strong className={ 'text-muted' }>
                    Gold
                  </strong>&nbsp;&nbsp;{ encounter.goldPieces }
                </ListGroup.Item>
              ) : null }
              { encounter.platinumPieces && encounter.platinumPieces > 0 ? (
                <ListGroup.Item>
                  <strong className={ 'text-muted' }>
                    Platinum
                  </strong>&nbsp;&nbsp;{ encounter.platinumPieces }
                </ListGroup.Item>
              ) : null }
            </ListGroup>
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer>
        <Link to={ `/app/campaigns/${campaign.slug}/adventures/${adventure.id}/encounters/${encounter.id}/edit` }
              className={ 'btn btn-info float-sm-right' }>
          Edit
        </Link>
      </Card.Footer>
    </Card>
  );
};

EncounterCard.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  encounter: PropTypes.object.isRequired,
  small: PropTypes.bool,
};

export default sortableElement(EncounterCard);