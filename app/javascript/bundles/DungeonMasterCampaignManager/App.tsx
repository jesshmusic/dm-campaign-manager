import React from 'react';
import { Provider } from 'react-redux';
import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import store from './store/store';
import Layout from './containers/Layout';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { ThemeProvider, theme, GlobalStyles } from './theme';
import { EditionProvider } from './contexts/EditionContext';
import { BreadcrumbProvider } from './contexts/BreadcrumbContext';
gsap.registerPlugin(ScrollToPlugin);

interface AppProps {
  [key: string]: unknown;
}

/** Only paths on this site, so a return path can't send the user elsewhere */
export const safeReturnTo = (returnTo?: string) =>
  returnTo?.startsWith('/') && !returnTo.startsWith('//') ? returnTo : undefined;

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();

  const onRedirectCallback = (appState?: AppState) => {
    // Return to the page the user was on before signing in (e.g. /link?code=…).
    // Navigating through the router, not history.replaceState, so that page renders.
    navigate(safeReturnTo(appState?.returnTo) ?? window.location.pathname, { replace: true });
  };

  return (
    <Auth0Provider
      domain="dev-yfmjdt5a.us.auth0.com"
      clientId="8NlYHEqMlhW6W4kVyNQLtyRguyiGSzrd"
      // Auth0 v2 requires authorizationParams object (v1 props are ignored)
      // Scope includes 'openid profile email' for OIDC user info claims
      authorizationParams={{
        redirect_uri: `${window.location.origin}/app/user-dashboard`,
        audience: 'dmScreenAPI',
        scope: 'openid profile email read:user',
      }}
      useRefreshTokens={true}
      cacheLocation="localstorage"
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
};

const App = (props: AppProps) => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <EditionProvider>
          <BreadcrumbProvider>
            <Provider store={store}>
              <AuthProvider>
                <Layout {...props} />
              </AuthProvider>
            </Provider>
          </BreadcrumbProvider>
        </EditionProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
