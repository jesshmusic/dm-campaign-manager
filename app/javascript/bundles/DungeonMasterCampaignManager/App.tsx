import React from 'react';
import { Provider } from 'react-redux';
import { Auth0Provider, useAuth0, User } from '@auth0/auth0-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import store from './store/store';
import Layout from './Layout';
import { LocationProvider } from '@reach/router';
gsap.registerPlugin(ScrollToPlugin);

const App = (props) => {
  return (
    <LocationProvider>
      <Provider store={store}>
        <Auth0Provider
          domain="dev-yfmjdt5a.us.auth0.com"
          clientId="8NlYHEqMlhW6W4kVyNQLtyRguyiGSzrd"
          redirectUri={window.location.origin}
          audience="dmScreenAPI"
          scope="read:user"
          useRefreshTokens
        >
          <Layout {...props} />
        </Auth0Provider>
      </Provider>
    </LocationProvider>
  );
};

export default App;
