import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import { ApiReference, AppProps } from '../utilities/types';

export const store = (props: AppProps) => {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      flashMessages: [],
      conditions: {
        conditions: [],
        count: props.conditions.count,
        currentCondition: null,
        loading: false,
      },
      dndClasses: {
        dndClasses: [],
        count: props.dndClasses.count,
        currentDndClass: null,
        loading: false,
      },
      items: {
        items: [],
        count: props.items.count,
        currentItem: null,
        loading: false,
      },
      monsters: {
        monsters: [],
        monsterTypes: [],
        count: props.monsters.count,
        currentMonster: null,
        loading: false,
      },
      races: {
        races: [],
        count: props.races.count,
        currentRace: null,
        loading: false,
      },
      sections: {
        sections: [],
        count: 0,
        currentSection: null,
        loading: false,
      },
      spells: {
        spells: [],
        count: props.spells.count,
        currentSpell: null,
        loading: false,
      },
      users: {
        users: [],
        count: props.users.count,
        // @ts-ignore
        currentUser: props.users.user,
      },
    },
  });
};
