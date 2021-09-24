import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from '../reducers';
import { Router } from '@reach/router';
import HomePage from './front-page/HomePage';
import Items from './items/Items';
import AllItems from './items/AllItems';
import Armor from './items/Armor';
import Gear from './items/Gear';
import MagicItems from './items/MagicItems';
import Tools from './items/Tools';
import Vehicles from './items/Vehicles';
import Weapons from './items/Weapons';
import Monsters from './npcs/Monsters';
import Spells from './spells/Spells';
import DndClass from './dnd-classes/DndClass';
import DndClasses from './dnd-classes/DndClasses';
import NpcGenerator from './npc-generator/NpcGenerator';
import { AppProps, FlashMessage } from '../utilities/types';

const store = (props: AppProps) => configureStore({
  reducer: rootReducer,
  preloadedState: {
    flashMessages: [],
    items: {
      items: [],
      count: props.itemsCount,
      currentItem: null
    },
    npcs: {
      npcs: [],
      count: props.npcsCount,
      currentNPC: null
    },
    races: {
      races: [],
      currentRace: null
    },
    spells: {
      spells: [],
      count: props.spellsCount,
      currentSpell: null
    },
    users: {
      user: props.user,
      users: [],
      currentUser: null
    }
  }
});

const Home = (props) => {
  const [flashMessages, setFlashMessages] = React.useState<FlashMessage[]>([]);

  const addFlashMessage = (flashMessage: FlashMessage) => {
    setFlashMessages([
      ...flashMessages,
      flashMessage
    ]);
  };

  const combinedProps = {
    ...props,
    flashMessages,
    addFlashMessage
  };

  return (
    <Provider store={store(props)}>
      <Router>
        <HomePage path='/' {...combinedProps} />
        <DndClass path='/app/classes/:dndClassSlug' {...combinedProps} />
        <DndClasses path='/app/classes' {...combinedProps} />
        <Items path='/app/items' {...combinedProps} />
        <AllItems path='/app/items/all/' {...combinedProps} />
        <Armor path='/app/items/armor/' {...combinedProps} />
        <Weapons path='/app/items/weapons/' {...combinedProps} />
        <MagicItems path='/app/items/magic-items/' {...combinedProps} />
        <Gear path='/app/items/gear/' {...combinedProps} />
        <Tools path='/app/items/tools/' {...combinedProps} />
        <Vehicles path='/app/items/vehicles/' {...combinedProps} />
        <Monsters path='/app/npcs/' {...combinedProps} />
        <Spells path='/app/spells/' {...combinedProps} />
        <NpcGenerator path='/app/npc-generator/' {...combinedProps} />
      </Router>
    </Provider>
  );
};

export default Home;
