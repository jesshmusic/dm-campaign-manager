import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';

export const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    flashMessages: [],
    items: {
      items: [],
      count: 0,
      currentItem: null
    },
    monsters: {
      monsters: [],
      monsterTypes: [],
      count: 0,
      currentMonster: null
    },
    races: {
      races: [],
      count: 0,
      currentRace: null
    },
    spells: {
      spells: [],
      count: 0,
      currentSpell: null
    },
    users: {
      user: null,
      users: [],
      currentUser: null
    }
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
