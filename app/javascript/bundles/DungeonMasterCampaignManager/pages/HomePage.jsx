import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import { Link as RouterLink } from '@reach/router';

// Container
import PageContainer from '../containers/PageContainer.jsx';

import styles from './home.module.scss';
import {Link} from '@reach/router';
import Button from '@material-ui/core/Button';

const ListItemLink = ({title, subtitle, path}) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar>
        <FolderIcon />
      </Avatar>
    </ListItemAvatar>
    <ListItemText
      primary={title}
      secondary={subtitle}
    />
    <ListItemSecondaryAction>
      <IconButton edge="end" aria-label="view" component={RouterLink} to={path}>
        <ArrowForwardIosIcon />
      </IconButton>
    </ListItemSecondaryAction>
  </ListItem>
);

class HomePage extends React.Component {
  render () {
    return (
      <PageContainer user={this.props.user} flashMessages={this.props.flashMessages}>
        <div>
          <div className="row">
            <div className="col">
              <h1>Dashboard</h1>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <h2>{this.props.campaigns.title}</h2>
              <List>
                {this.props.campaigns.campaigns.map((campaign) =>
                  <ListItemLink title={campaign.name}
                    subtitle={campaign.user.name}
                    path={`/campaigns/${campaign.slug}`}
                    key={campaign.slug}/>
                )}
              </List>
            </div>
            <div className="col">
              <h3>{this.props.dungeonMasters.title}</h3>
              <List>
                {this.props.dungeonMasters.dungeonMasters.map((dm, index) =>
                  <ListItemLink title={dm.name}
                    subtitle={'Dungeon Master'}
                    path={`/dungeon_masters/${dm.username}`}
                    key={index}/>
                )}
              </List>
              { this.props.playerCharacters ? (
                <div>
                  <h3>{this.props.playerCharacters.title}</h3>
                  <ul className="list-group list-group-flush">
                    {this.props.playerCharacters.characters.map((character, index) => <li key={index} className="list-group-item">{character.name}</li>)}
                  </ul>
                </div>
              ) : null}
              { this.props.nonPlayerCharacters ? (
                <div>
                  <h3>{this.props.nonPlayerCharacters.title}</h3>
                  <ul className="list-group list-group-flush">
                    {this.props.nonPlayerCharacters.characters.map((character, index) => <li key={index} className="list-group-item">{character.name}</li>)}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
}

HomePage.propTypes = {
  campaigns: PropTypes.object,
  nonPlayerCharacters: PropTypes.object,
  playerCharacters: PropTypes.object,
  dungeonMasters: PropTypes.object,
  user: PropTypes.object,
  flashMessages: PropTypes.array,
};

function mapStateToProps (state) {
  return {
    campaigns: state.campaigns,
    nonPlayerCharacters: state.nonPlayerCharacters,
    playerCharacters: state.playerCharacters,
    dungeonMasters: state.dungeonMasters,
    user: state.user,
    flashMessages: state.flashMessages,
  };
}

function mapDispatchToProps (dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
