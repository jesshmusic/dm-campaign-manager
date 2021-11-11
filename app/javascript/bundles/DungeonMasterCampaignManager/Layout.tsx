import React from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { connect } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { useAuth0, User } from '@auth0/auth0-react';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import HomePage from './pages/front-page/HomePage';
import Items from './pages/items/Items';
import Monsters from './pages/monsters/Monsters';
import Spells from './pages/spells/Spells';
import DndClass from './pages/dnd-classes/DndClass';
import DndClasses from './pages/dnd-classes/DndClasses';
import MonsterGenerator from './pages/monster-generator/MonsterGenerator';
import { FlashMessage } from './utilities/types';
import Monster from './pages/monsters/Monster';
import Races from './pages/races/Races';
import Race from './pages/races/Race';
import Spell from './pages/spells/Spell';
import Section from './pages/sections/Section';
import Util from './utilities/utilities';
import Item from './pages/items/Item';
import Condition from './pages/conditions/Condition';
import Conditions from './pages/conditions/Conditions';
import HeroBanner from './components/HeroBanner/HeroBanner';
import Footer from './components/Footer/Footer';
import rest from './api/api';
import UserDashboard from './pages/user-dashboard/UserDashboard';
import ProtectedRoute from './components/ProtectedRoute';

const styles = require('./app.module.scss');
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

  const onEnterHandler = (node) => {
    gsap.from(node, {
      duration: 0.4,
      autoAlpha: 0,
      x: -500,
    });
    gsap.to(node, {
      delay: 0.4,
      duration: 0.4,
      scrollTo: 0,
    });
  };

  const onExitHandler = (node) => {
    gsap.to(node, {
      duration: 1,
      autoAlpha: 0,
      scrollTo: 0,
      x: -500,
    });
  };

  return (
    <div className={styles.appContainer} ref={parentNode}>
      <HeroBanner />
      <TransitionGroup component={null}>
        <Transition
          timeout={500}
          key={window.location.pathname}
          onEnter={onEnterHandler}
          onExit={onExitHandler}
        >
          <Routes>
            <Route path="/" element={<HomePage {...combinedProps} />} />
            <Route
              path="/app/classes/:dndClassSlug"
              {...combinedProps}
              element={DndClass}
            />
            <Route
              path="/app/classes"
              {...combinedProps}
              element={<DndClasses {...combinedProps} />}
            />
            <Route
              path="/app/races"
              {...combinedProps}
              element={<Races {...combinedProps} />}
            />
            <Route
              path="/app/races/:raceSlug"
              {...combinedProps}
              element={<Race {...combinedProps} />}
            />
            <Route
              path="/app/conditions"
              {...combinedProps}
              element={<Conditions {...combinedProps} />}
            />
            <Route
              path="/app/conditions/:conditionSlug"
              {...combinedProps}
              element={<Condition {...combinedProps} />}
            />
            {Util.itemPages.map((itemPage) => (
              <Route
                path={itemPage.path}
                key={itemPage.itemType}
                element={
                  <Items
                    {...combinedProps}
                    itemType={itemPage.itemType}
                    pageTitle={itemPage.pageTitle}
                  />
                }
              />
            ))}
            <Route
              path="/app/items/:itemSlug"
              element={<Item {...combinedProps} />}
            />
            <Route
              path="/app/monsters/"
              element={<Monsters {...combinedProps} />}
            />
            <Route
              path="/app/monsters/:monsterSlug"
              element={<Monster {...combinedProps} />}
            />
            <Route
              path="/app/spells/"
              element={<Spells {...combinedProps} />}
            />
            <Route
              path="/app/spells/:spellSlug"
              element={<Spell {...combinedProps} />}
            />
            <Route
              path="/app/sections/:sectionSlug"
              element={<Section {...combinedProps} />}
            />
            <Route
              path="/app/monster-generator/"
              element={<MonsterGenerator {...combinedProps} />}
            />
            <Route
              path="/app/user-dashboard"
              element={<ProtectedRoute as={UserDashboard} {...combinedProps} />}
            />
            <Route path="*" element={<HomePage {...combinedProps} />} />
          </Routes>
        </Transition>
      </TransitionGroup>
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
