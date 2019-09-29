/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import EncounterCard from './EncounterCard';
import {sortableContainer} from 'react-sortable-hoc';
import VirtualList from 'react-tiny-virtual-list';
import arrayMove from 'array-move';
import {getHeaders} from '../../../actions/api';
import snakecaseKeys from 'snakecase-keys';

const SortableEncountersList = sortableContainer(({
  encounters,
  adventure,
  campaign,
  small,
}) => (
  <VirtualList
    height={800}
    renderItem={({index, style}) =>
      <EncounterCard adventure={adventure}
                     campaign={campaign}
                     encounter={encounters[index]}
                     key={encounters[index].id}
                     index={index}
                     small={small}
                     style={style}
      />
    }
    itemCount={encounters.length}
    itemSize={272}/>
));
SortableEncountersList.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  encounters: PropTypes.array.isRequired,
  small: PropTypes.bool,
};

class EncountersList extends React.Component {
  state = {
    encounters: this.props.adventure.encounters,
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) {
      return;
    }

    const {encounters} = this.state;
    const sortedEncounterss = arrayMove(encounters, oldIndex, newIndex);
    this.setState({
      encounters: sortedEncounterss,
    }, () => {
      fetch(`/v1/campaigns/${this.props.campaign.slug}/adventures/${this.props.adventure.id}/`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(snakecaseKeys({
          adventure: {
            encountersAttributes: sortedEncounterss.map((encounter, index) => ({
              id: encounter.id,
              sort: index,
            })),
          },
        })),
      }).then((response) => response.json());
    });
  };

  render () {
    const {
      adventure,
      campaign,
      small,
    } = this.props;

    const { encounters } = this.state;

    return (
      <SortableEncountersList
        adventure={adventure}
        campaign={campaign}
        encounters={encounters}
        onSortEnd={this.onSortEnd}
        small={small}
      />
    );
  }
}

EncountersList.propTypes = {
  adventure: PropTypes.object.isRequired,
  campaign: PropTypes.object.isRequired,
  small: PropTypes.bool,
};

export default EncountersList;