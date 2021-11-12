import React from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { connect } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { useAuth0, User } from '@auth0/auth0-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import HomePage from '../pages/front-page/HomePage';
import Items from '../pages/items/Items';
import Monsters from '../pages/monsters/Monsters';
import Spells from '../pages/spells/Spells';
import DndClass from '../pages/dnd-classes/DndClass';
import DndClasses from '../pages/dnd-classes/DndClasses';
import MonsterGenerator from '../pages/monster-generator/MonsterGenerator';
import { FlashMessage } from '../utilities/types';
import Monster from '../pages/monsters/Monster';
import Races from '../pages/races/Races';
import Race from '../pages/races/Race';
import Spell from '../pages/spells/Spell';
import Section from '../pages/sections/Section';
import Util from '../utilities/utilities';
import Item from '../pages/items/Item';
import Condition from '../pages/conditions/Condition';
import Conditions from '../pages/conditions/Conditions';
import HeroBanner from '../components/HeroBanner/HeroBanner';
import Footer from '../components/Footer/Footer';
import rest from '../api/api';
import UserDashboard from '../pages/user-dashboard/UserDashboard';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/admin-dashboard/AdminDashboard';
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
          props.setUser(user, token);
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
    setUser: (user: User, token: string) => {
      let {
        sub,
        nickname,
        given_name,
        family_name,
        locale,
        picture,
        updated_at,
        email_verified,
        ...userFields
      } = user;
      userFields.auth_id = sub;
      userFields.username = nickname;
      dispatch(
        rest.actions.setUser(
          {},
          {
            body: JSON.stringify({ user: userFields }),
            token,
          }
        )
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
