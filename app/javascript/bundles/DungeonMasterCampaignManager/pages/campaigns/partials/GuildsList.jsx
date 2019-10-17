/**
 * Created by jesshendricks on 10/16/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Card from 'react-bootstrap/Card';
import CharactersList from '../../characters/partials/CharactersList';
import {Link} from '@reach/router';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const GuildsList = ({
  campaignSlug,
  guilds,
}) => {
  return (
    guilds.map((guild, index) => (
      <Card key={index} className={'mb-1'}>
        <Card.Body>
          <h4>{guild.name}</h4>
          <div dangerouslySetInnerHTML={{ __html: guild.description }} />
          <Row>
            {guild.pcs && guild.pcs.length > 0 ? (
              <Col md={6}>
                <h5>Player Characters</h5>
                {guild.pcs.map((pc, index) => (
                  <Link to={`/app/campaigns/${campaignSlug}/pcs/${pc.slug}`}
                        className={`d-flex justify-content-between ${pc.status === 'dead' ? 'text-muted' : null}`}
                        key={index}>
                    {pc.name}
                  </Link>
                ))}
              </Col>
            ) : null}
            {guild.npcs && guild.npcs.length > 0 ? (
              <Col md={6}>
                <h5>Non-player Characters</h5>
                {guild.npcs.map((npc, index) => (
                  <Link to={`/app/campaigns/${campaignSlug}/npcs/${npc.slug}`}
                        className={`d-flex justify-content-between ${npc.status === 'dead' ? 'text-muted' : null}`}
                        key={index}>
                    {npc.name} <small className="text-muted">&ldquo;{npc.role}&rdquo;</small>
                  </Link>
                ))}
              </Col>
            ) : null}
          </Row>
        </Card.Body>
      </Card>
    ))
  );
};

GuildsList.propTypes = {
  campaignSlug: PropTypes.string.isRequired,
  guilds: PropTypes.array.isRequired,
};

export default GuildsList;