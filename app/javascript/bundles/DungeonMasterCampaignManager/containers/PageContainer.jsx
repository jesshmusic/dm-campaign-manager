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
    padding: theme.spacing(6, 0, 2),
  },
  title: {
    flexGrow: 1,
  },
}));

const PageContainer = (props) => {
  const { children, user, flashMessages } = props;
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleDrawerToggle () {
    setMobileOpen(!mobileOpen);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Typography component='div'>
          <div className={classes.root}>
            <HeroBanner />
            <FlashMessages messages={flashMessages}/>
            <Navbar user={user} mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
            <MenuBar onClick={handleDrawerToggle} user={user}/>
            <main className={classes.content}>
              <Container maxWidth="lg">
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
  children: PropTypes.element.isRequired,
  user: PropTypes.object,
  flashMessages: PropTypes.array,
};

export default PageContainer;
