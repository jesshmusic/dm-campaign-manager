import React from 'react';
import { Provider } from 'react-redux';
import { Router } from '@reach/router';
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
import { ItemType } from './items/use-data';
import Races from './races/Races';
import Race from './races/Race';
import Spell from './spells/Spell';
import Section from './sections/Section';
import SideBar from '../components/SideBar/SideBar';
import Util from '../utilities/utilities';
import Item from './items/Item';

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
        <Items
          path="/app/items"
          {...combinedProps}
          itemType={ItemType.all}
          key={ItemType.all}
          pageTitle="All Equipment and Items"
        />
        <Items
          path="/app/items/armor/"
          {...combinedProps}
          itemType={ItemType.armor}
          key={ItemType.armor}
          pageTitle="Armor"
        />
        <Items
          path="/app/items/gear/"
          {...combinedProps}
          itemType={ItemType.gear}
          key={ItemType.gear}
          pageTitle="Gear"
        />
        <Items
          path="/app/items/magic-items/"
          {...combinedProps}
          itemType={ItemType.magic}
          key={ItemType.magic}
          pageTitle="Magic Items"
        />
        <Items
          path="/app/items/magic-armor/"
          {...combinedProps}
          itemType={ItemType.magicArmor}
          key={ItemType.magicArmor}
          pageTitle="Magic Armor"
        />
        <Items
          path="/app/items/magic-weapons/"
          {...combinedProps}
          itemType={ItemType.magicWeapon}
          key={ItemType.magicWeapon}
          pageTitle="Magic Weapons"
        />
        <Items
          path="/app/items/tools/"
          {...combinedProps}
          itemType={ItemType.tool}
          key={ItemType.tool}
          pageTitle="Tools"
        />
        <Items
          path="/app/items/vehicles/"
          {...combinedProps}
          itemType={ItemType.vehicle}
          key={ItemType.vehicle}
          pageTitle="Vehicles and Mounts"
        />
        <Items
          path="/app/items/weapons/"
          {...combinedProps}
          itemType={ItemType.weapon}
          key={ItemType.weapon}
          pageTitle="Weapons"
        />
        <Item path="/app/items/:itemSlug" {...combinedProps} />
        <Monsters path="/app/monsters/" {...combinedProps} />
        <Monster path="/app/monsters/:monsterSlug" {...combinedProps} />
        <Spells path="/app/spells/" {...combinedProps} />
        <Spell path="/app/spells/:spellSlug" {...combinedProps} />
        <Section path="/app/sections/:sectionSlug" {...combinedProps} />
        <MonsterGenerator path="/app/monster-generator/" {...combinedProps} />
      </Router>
    </Provider>
  );
};

export default Home;
