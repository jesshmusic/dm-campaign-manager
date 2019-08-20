import React from 'react';
import PropTypes from 'prop-types';
import { createMuiTheme, responsiveFontSizes, makeStyles  } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Footer from '../components/layout/Footer/Footer.jsx';
import HeroBanner from '../components/layout/HeroBanner/HeroBanner.jsx';
import MenuBar from '../components/layout/MenuBar';
import Navbar from '../components/layout/Navbar/Navbar.jsx';
import FlashMessages from '../components/layout/Alerts/FlashMessages.jsx';

import '../stylesheets/_global.scss';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#d32f2f',
    },
    secondary: {
      main: '#ffc107',
    },
  },
  spacing: 10,
  typography: {
    fontFamily: 'Lora',
  },
});
theme = responsiveFontSizes(theme);

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(8, 0, 2),
  },
  pageContainer: {
    padding: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const PageContainer = (props) => {
  const { children, logoutUser, user, flashMessages, pageTitle } = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    logoutUser();
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Typography component='div'>
          <div className={classes.root}>
            <Navbar user={user} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <MenuBar onClick={handleDrawerToggle} user={user} handleLogoutUser={handleLogout}/>
            <main className={classes.content}>
              <HeroBanner />
              <FlashMessages messages={flashMessages}/>
              <Container maxWidth="lg" className={classes.pageContainer}>
                <Typography variant="h2" component="h1" gutterBottom>
                  {pageTitle}
                </Typography>
                {children}
              </Container>
              <Footer user={user} />
            </main>
          </div>
        </Typography>
      </ThemeProvider>
    </React.Fragment>
  );
};

PageContainer.propTypes = {
  children: PropTypes.element,
  flashMessages: PropTypes.array,
  logoutUser: PropTypes.func.isRequired,
  pageTitle: PropTypes.string.isRequired,
  user: PropTypes.object,
};

export default PageContainer;
