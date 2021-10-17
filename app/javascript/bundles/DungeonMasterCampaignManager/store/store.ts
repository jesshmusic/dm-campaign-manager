import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import { AppProps } from '../utilities/types';

export const store = (props: AppProps) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: {
      flashMessages: [],
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
        currentUser: props.users.currentUser,
      },
    },
  });
