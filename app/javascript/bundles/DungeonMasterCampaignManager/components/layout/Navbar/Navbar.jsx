import React from 'react';
import PropTypes from 'prop-types';

import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import Link from '@material-ui/core/Link';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles, useTheme } from '@material-ui/core/styles';

import { Link as RouterLink } from '@reach/router';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
    zIndex: 1000,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(6, 0, 2),
  },
  title: {
    flexGrow: 1,
  },
}));


function Navbar(props) {
  const { container, mobileOpen, handleDrawerToggle } = props;
  const classes = useStyles();
  const theme = useTheme();
  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon><MenuIcon /></ListItemIcon>
          <Link component={RouterLink} to={'/'}>Home</Link>
        </ListItem>
        <ListItem button>
          <ListItemIcon><MenuIcon /></ListItemIcon>
          <Link component={RouterLink} to={'/campaigns'}>Campaigns</Link>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button>
          <ListItemIcon><MenuIcon /></ListItemIcon>
          <Link component={RouterLink} to={'/'}>Home</Link>
        </ListItem>
        <ListItem button>
          <ListItemIcon><MenuIcon /></ListItemIcon>
          <Link component={RouterLink} to={'/campaigns'}>Campaigns</Link>
        </ListItem>
      </List>
    </div>
  );

  return (
    <nav className={classes.drawer} aria-label="site pages">
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

Navbar.propTypes = {
  container: PropTypes.object,
  mobileOpen: PropTypes.bool,
  handleDrawerToggle: PropTypes.func,
  user: PropTypes.object,
};

export default Navbar;
