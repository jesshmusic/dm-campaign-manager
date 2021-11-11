import React from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { connect } from 'react-redux';
import { Location, Router } from '@reach/router';
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
import SideBar from './components/SideBar/SideBar';
import Util from './utilities/utilities';
import Item from './pages/items/Item';
import Condition from './pages/conditions/Condition';
import Conditions from './pages/conditions/Conditions';
import HeroBanner from './components/HeroBanner/HeroBanner';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import Footer from './components/Footer/Footer';
import rest from './api/api';

const styles = require('./app.module.scss');
gsap.registerPlugin(ScrollToPlugin);

const Layout = (props) => {
  const [flashMessages, setFlashMessages] = React.useState<FlashMessage[]>([]);
  const [isMobile, setIsMobile] = React.useState(Util.isMobileWidth());
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

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(Util.isMobileWidth());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
      <SideBar isCollapsed={isMobile} />
      <HeroBanner />
      <Location>
        {({ location }) => (
          <>
            <Breadcrumbs location={location} />
            <TransitionGroup component={null}>
              <Transition
                timeout={500}
                key={location.pathname}
                onEnter={onEnterHandler}
                onExit={onExitHandler}
              >
                <Router primary={false} location={location}>
                  <HomePage path="/" {...combinedProps} />
                  <DndClass
                    path="/app/classes/:dndClassSlug"
                    {...combinedProps}
                  />
                  <DndClasses path="/app/classes" {...combinedProps} />
                  <Races path="/app/races" {...combinedProps} />
                  <Race path="/app/races/:raceSlug" {...combinedProps} />
                  <Conditions path="/app/conditions/" {...combinedProps} />
                  <Condition
                    path="/app/conditions/:conditionSlug"
                    {...combinedProps}
                  />
                  {Util.itemPages.map((itemPage) => (
                    <Items
                      path={itemPage.path}
                      {...combinedProps}
                      itemType={itemPage.itemType}
                      key={itemPage.itemType}
                      pageTitle={itemPage.pageTitle}
                    />
                  ))}
                  <Item path="/app/items/:itemSlug" {...combinedProps} />
                  <Monsters path="/app/monsters/" {...combinedProps} />
                  <Monster
                    path="/app/monsters/:monsterSlug"
                    {...combinedProps}
                  />
                  <Spells path="/app/spells/" {...combinedProps} />
                  <Spell path="/app/spells/:spellSlug" {...combinedProps} />
                  <Section
                    path="/app/sections/:sectionSlug"
                    {...combinedProps}
                  />
                  <MonsterGenerator
                    path="/app/monster-generator/"
                    {...combinedProps}
                  />
                </Router>
              </Transition>
            </TransitionGroup>
          </>
        )}
      </Location>
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
