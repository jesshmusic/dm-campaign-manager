import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import FolderIcon from '@material-ui/icons/Folder';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import { Link as RouterLink } from '@reach/router';

// Container
import PageContainer from '../containers/PageContainer.jsx';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: theme.spacing(5),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const ListItemLink = ({title, subtitle, path, iconType}) => (
  <ListItem>
    <ListItemAvatar>
      <Avatar>
        {iconType === 'folder' ? <FolderIcon /> : <AccountCircleIcon/>}
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

ListItemLink.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
  iconType: PropTypes.string,
};

function HomePage (props) {
  const classes = useStyles();

  return (
    <PageContainer user={props.user} flashMessages={props.flashMessages}>
      <div className={classes.root}>
        <Typography variant="h2" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h4" component="h2" gutterBottom>
                {props.campaigns.title}
              </Typography>
              <List>
                {props.campaigns.campaigns.map((campaign) =>
                  <ListItemLink title={campaign.name}
                    subtitle={campaign.user.name}
                    path={`/campaigns/${campaign.slug}`}
                    key={campaign.slug}
                    iconType={'folder'}/>
                )}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Paper className={classes.paper}>
              <Typography variant="h4" component="h2" gutterBottom>
                {props.dungeonMasters.title}
              </Typography>
              <List>
                {props.dungeonMasters.dungeonMasters.map((dm, index) =>
                  <ListItemLink title={dm.name}
                    subtitle={'Dungeon Master'}
                    path={`/dungeon_masters/${dm.username}`}
                    key={index}/>
                )}
              </List>
            </Paper>
          </Grid>
          { props.playerCharacters ? (
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {props.playerCharacters.title}
                </Typography>
                <List>
                  {props.playerCharacters.characters.map((character) =>
                    <ListItemLink title={character.name}
                      subtitle={`Level ${character.level} ${character.race}`}
                      path={`/player_characters/${character.slug}`}
                      key={character.slug}/>
                  )}
                </List>
              </Paper>
            </Grid>
          ) : null}
          { props.nonPlayerCharacters ? (
            <Grid item xs={12} sm={6}>
              <Paper className={classes.paper}>
                <Typography variant="h4" component="h2" gutterBottom>
                  {props.nonPlayerCharacters.title}
                </Typography>
                <List>
                  {props.nonPlayerCharacters.characters.map((character) =>
                    <ListItemLink title={character.name}
                      subtitle={`Level ${character.level} ${character.race}`}
                      path={`/player_characters/${character.slug}`}
                      key={character.slug}/>
                  )}
                </List>
              </Paper>
            </Grid>
          ) : null}
        </Grid>
      </div>
    </PageContainer>
  );
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
