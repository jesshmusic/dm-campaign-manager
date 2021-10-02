import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';
import { AppProps } from '../utilities/types';

export const store = (props: AppProps) => configureStore({
  reducer: rootReducer,
  preloadedState: {
    flashMessages: [],
    items: {
      items: [],
      count: props.items.count,
      currentItem: null
    },
    monsters: {
      monsters: [],
      monsterTypes: [],
      count: props.monsters.count,
      currentMonster: null
    },
    races: {
      races: [],
      count: props.races.count,
      currentRace: null
    },
    spells: {
      spells: [],
      count: props.spells.count,
      currentSpell: null
    },
    users: {
      users: [],
      count: props.users.count,
      // @ts-ignore
      currentUser: props.user
    }
  }
});
