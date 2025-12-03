import React from 'react';
import { Provider } from 'react-redux';
import { Auth0Provider } from '@auth0/auth0-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import store from './store/store';
import Layout from './containers/Layout';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, theme, GlobalStyles } from './theme';
gsap.registerPlugin(ScrollToPlugin);

const App = (props) => {
  const onRedirectCallback = (appState) => {
    // Return to the page the user was on before auth redirect
    window.history.replaceState({}, document.title, appState?.returnTo || window.location.pathname);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Provider store={store}>
          <Auth0Provider
            domain="dev-yfmjdt5a.us.auth0.com"
            clientId="8NlYHEqMlhW6W4kVyNQLtyRguyiGSzrd"
            authorizationParams={{
              redirect_uri: `${window.location.origin}/app/user-dashboard`,
              audience: 'dmScreenAPI',
              scope: 'openid profile email read:user',
            }}
            useRefreshTokens={true}
            cacheLocation="localstorage"
            onRedirectCallback={onRedirectCallback}
          >
            <Layout {...props} />
          </Auth0Provider>
        </Provider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
