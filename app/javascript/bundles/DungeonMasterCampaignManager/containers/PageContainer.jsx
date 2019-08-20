import React from 'react';
import PropTypes from 'prop-types';
import { createMuiTheme, responsiveFontSizes  } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

import Footer from '../components/layout/Footer/Footer.jsx';
import HeroBanner from '../components/layout/HeroBanner/HeroBanner.jsx';
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

const PageContainer = (props) => (
  <React.Fragment>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <Typography component='div'>
        <Navbar user={props.user}>
          <FlashMessages messages={props.flashMessages}/>
          <HeroBanner />
          <Container maxWidth="lg">
            {props.children}
          </Container>
          <Footer user={props.user} />
        </Navbar>
      </Typography>
    </ThemeProvider>
  </React.Fragment>
);

PageContainer.propTypes = {
  children: PropTypes.element.isRequired,
  user: PropTypes.object,
  flashMessages: PropTypes.array,
};

export default PageContainer;
