import React from 'react';
import { connect, Provider } from 'react-redux';
import { Router, Link } from '@reach/router';
import HomePage from './front-page/HomePage';
import Items from './items/Items';
import Monsters from './monsters/Monsters';
import Spells from './spells/Spells';
import DndClass from './dnd-classes/DndClass';
import DndClasses from './dnd-classes/DndClasses';
import MonsterGenerator from './monster-generator/MonsterGenerator';
import { FlashMessage } from '../utilities/types';
import { store } from '../store/store';
import Monster from './monsters/Monster';
import Races from './races/Races';
import Race from './races/Race';
import Spell from './spells/Spell';
import Section from './sections/Section';
import SideBar from '../components/SideBar/SideBar';
import Util from '../utilities/utilities';
import Item from './items/Item';
import ProtectedRoute from '../components/ProtectedRoute';

const Home = (props) => {
  const [flashMessages, setFlashMessages] = React.useState<FlashMessage[]>([]);
  const [isMobile, setIsMobile] = React.useState(Util.isMobileWidth());

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

  return (
    <Provider store={store(props)}>
      <SideBar isCollapsed={isMobile} />
      <Router>
        <HomePage path="/" {...combinedProps} />
        <DndClass path="/app/classes/:dndClassSlug" {...combinedProps} />
        <DndClasses path="/app/classes" {...combinedProps} />
        <Races path="/app/races" {...combinedProps} />
        <Race path="/app/races/:raceSlug" {...combinedProps} />
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
        <Monster path="/app/monsters/:monsterSlug" {...combinedProps} />
        <Spells path="/app/spells/" {...combinedProps} />
        <Spell path="/app/spells/:spellSlug" {...combinedProps} />
        <Section path="/app/sections/:sectionSlug" {...combinedProps} />
        <ProtectedRoute
          path="/app/monster-generator/"
          as={MonsterGenerator}
          {...combinedProps}
        />
      </Router>
    </Provider>
  );
};

export default Home;
