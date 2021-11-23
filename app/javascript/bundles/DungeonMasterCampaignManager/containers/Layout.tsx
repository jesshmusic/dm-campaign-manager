import React from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { connect } from 'react-redux';
import { useAuth0, User } from '@auth0/auth0-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { FlashMessage } from '../utilities/types';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import Footer from '../components/Footer/Footer';
import rest from '../api/api';
import DMRoutes from '../components/DMRoutes';

const styles = require('./layout.module.scss');
gsap.registerPlugin(ScrollToPlugin);

const Layout = (props) => {
  const [flashMessages, setFlashMessages] = React.useState<FlashMessage[]>([]);
  const parentNode = React.useRef(null);

  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();

  React.useEffect(() => {
    if (isAuthenticated && user) {
      getAccessTokenSilently()
        .then((token) => {
          props.logInUser(user, token);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [user]);

  const addFlashMessage = (flashMessage: FlashMessage) => {
    setFlashMessages([...flashMessages, flashMessage]);
  };

  const combinedProps = {
    ...props,
    flashMessages,
    addFlashMessage,
  };

  return (
    <div className={styles.appContainer} ref={parentNode}>
      <HeroBanner />
      <DMRoutes {...combinedProps} />
      <Footer user={combinedProps.user} />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    currentUser: state.users.currentUser,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logInUser: (user: User, token: string) => {
      const currentUser = {
        auth_id: user.sub,
        email: user.email,
        name: user.name,
        roles: user['https://dm-campaign-manager.appRoles'],
        username: user.nickname,
      };
      dispatch(
        rest.actions.login(
          {},
          {
            body: JSON.stringify({ user: currentUser }),
            token,
          }
        )
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
