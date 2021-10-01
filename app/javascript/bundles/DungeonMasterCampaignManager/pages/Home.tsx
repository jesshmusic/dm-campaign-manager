import React from 'react';
import { Provider } from 'react-redux';
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
import Monsters from './monsters/Monsters';
import Spells from './spells/Spells';
import DndClass from './dnd-classes/DndClass';
import DndClasses from './dnd-classes/DndClasses';
import MonsterGenerator from './monster-generator/MonsterGenerator';
import { FlashMessage } from '../utilities/types';
import { store } from '../store/store';


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
    <Provider store={store}>
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
        <Monsters path='/app/monsters/' {...combinedProps} />
        <Spells path='/app/spells/' {...combinedProps} />
        <MonsterGenerator path='/app/monster-generator/' {...combinedProps} />
      </Router>
    </Provider>
  );
};

export default Home;
