/**
 * Created by jesshendricks on 9/4/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import { sortableContainer } from 'react-sortable-hoc';
import AdventureCard from './AdventureCard';
import VirtualList from 'react-tiny-virtual-list';
import arrayMove from 'array-move';
import { getHeaders } from '../../../actions/api';
import snakecaseKeys from 'snakecase-keys';

const SortableAdventuresList = sortableContainer(({
  adventures,
  campaign,
  deleteAdventure,
  onUpdateAdventure,
  small,
}) => (
  <VirtualList
    height={800}
    renderItem={({index, style}) =>
      <AdventureCard adventure={adventures[index]}
                     campaign={campaign}
                     deleteAdventure={deleteAdventure}
                     updateAdventure={onUpdateAdventure}
                     key={adventures[index].id}
                     index={index}
                     small={small}
                     style={style}
      />
    }
    itemCount={adventures.length}
    itemSize={272}/>
));
SortableAdventuresList.propTypes = {
  adventures: PropTypes.array.isRequired,
  campaign: PropTypes.object.isRequired,
  deleteAdventure: PropTypes.func.isRequired,
  onUpdateAdventure: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

class AdventuresList extends React.Component {
  state = {
    adventures: this.props.campaign.adventures,
  };

  onSortEnd = ({oldIndex, newIndex}) => {
    if (oldIndex === newIndex) {
      return;
    }

    const {adventures} = this.state;
    const sortedAdventures = arrayMove(adventures, oldIndex, newIndex);
    this.setState({
      adventures: sortedAdventures,
    }, () => {
      fetch(`/v1/campaigns/${this.props.campaign.slug}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(snakecaseKeys({
          campaign: {
            adventuresAttributes: sortedAdventures.map((adventure, index) => ({
              id: adventure.id,
              sort: index,
            })),
          },
        })),
      }).then((response) => response.json());
    });
  };

  render () {
    const {
      campaign,
      deleteAdventure,
      onUpdateAdventure,
      small,
    } = this.props;

    const { adventures } = this.state;

    return (
      <SortableAdventuresList
        adventures={adventures}
        campaign={campaign}
        deleteAdventure={deleteAdventure}
        onUpdateAdventure={onUpdateAdventure}
        onSortEnd={this.onSortEnd}
        small={small}
        useDragHandle
      />
    );
  }
}

AdventuresList.propTypes = {
  campaign: PropTypes.object.isRequired,
  deleteAdventure: PropTypes.func.isRequired,
  onUpdateAdventure: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

export default AdventuresList;