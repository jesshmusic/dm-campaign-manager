import React from 'react';
import {configureStore} from '@reduxjs/toolkit';
import {Provider} from 'react-redux';
import rootReducer from '../reducers';
import {Router} from '@reach/router';
import HomePage from './front-page/HomePage';
import Items from './items/Items';
import AllItems from './items/AllItems';
import Armor from './items/Armor';
import Gear from './items/Gear';
import MagicItems from './items/MagicItems';
import Tools from './items/Tools';
import Vehicles from './items/Vehicles';
import Weapons from './items/Weapons';
import NPCs from './npcs/NPC';
import Spells from './spells/Spells';
import DndClass from './dnd-classes/DndClass';
import DndClasses from './dnd-classes/DndClasses';
import NpcGenerator from './npc-generator/NpcGenerator';
import {AppProps} from "../utilities/types";

const store = (props: AppProps) => configureStore({
  reducer: rootReducer,
  preloadedState: {
    flashMessages: [],
    items: {
      items: [],
      count: props.itemsCount,
      currentItem: null,
    },
    npcs: {
      npcs: [],
      count: props.npcsCount,
      currentNPC: null,
    },
    races: {
      races: [],
      currentRace: null,
    },
    spells: {
      spells: [],
      count: props.spellsCount,
      currentSpell: null,
    },
    users: {
      user: props.user,
      users: [],
      currentUser: null,
    },
  },
});

const Home = (props) => (
  <Provider store={store(props)}>
    <Router>
      <HomePage path="/" {...props}/>
      <DndClass path='/app/classes/:dndClassSlug' {...props}/>
      <DndClasses path='/app/classes' {...props}/>
      <Items path='/app/items' {...props}/>
      <AllItems path='/app/items/all/' {...props}/>
      <Armor path='/app/items/armor/' {...props}/>
      <Weapons path='/app/items/weapons/' {...props}/>
      <MagicItems path='/app/items/magic-items/' {...props}/>
      <Gear path='/app/items/gear/' {...props}/>
      <Tools path='/app/items/tools/' {...props}/>
      <Vehicles path='/app/items/vehicles/' {...props}/>
      <NPCs path='/app/npcs/' {...props}/>
      <Spells path='/app/spells/' {...props}/>
      <NpcGenerator path='/app/npc-generator/' {...props}/>
    </Router>
  </Provider>
);

export default Home;
