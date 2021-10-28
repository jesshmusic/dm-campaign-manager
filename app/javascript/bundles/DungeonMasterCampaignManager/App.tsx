import React from 'react';
import { TransitionGroup, Transition } from 'react-transition-group';
import { Provider } from 'react-redux';
import { Location, Router } from '@reach/router';
import { Auth0Provider } from '@auth0/auth0-react';
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
import { store } from './store/store';
import Monster from './pages/monsters/Monster';
import Races from './pages/races/Races';
import Race from './pages/races/Race';
import Spell from './pages/spells/Spell';
import Section from './pages/sections/Section';
import SideBar from './components/SideBar/SideBar';
import Util from './utilities/utilities';
import Item from './pages/items/Item';
import ProtectedRoute from './components/ProtectedRoute';
import Condition from './pages/conditions/Condition';
import Conditions from './pages/conditions/Conditions';
import HeroBanner from './components/HeroBanner/HeroBanner';
import Breadcrumbs from './components/Breadcrumbs/Breadcrumbs';
import Footer from './components/Footer/Footer';

const styles = require('./app.module.scss');
gsap.registerPlugin(ScrollToPlugin);

const App = (props) => {
  const [flashMessages, setFlashMessages] = React.useState<FlashMessage[]>([]);
  const [isMobile, setIsMobile] = React.useState(Util.isMobileWidth());
  const parentNode = React.useRef(null);

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
    <Auth0Provider
      domain="dev-yfmjdt5a.us.auth0.com"
      clientId="8NlYHEqMlhW6W4kVyNQLtyRguyiGSzrd"
      redirectUri={window.location.origin}
      audience="dmScreenAPI"
      scope="read:user"
      useRefreshTokens
    >
      <Provider store={store(props)}>
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
                      <ProtectedRoute
                        path="/app/monster-generator/"
                        as={MonsterGenerator}
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
      </Provider>
    </Auth0Provider>
  );
};

export default App;
