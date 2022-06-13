import { configureStore } from '@reduxjs/toolkit';
import rootReducer from '../reducers';

// export const store = (props: AppProps) => {
const store = configureStore({
  reducer: rootReducer,
  preloadedState: {
    flashMessages: [],
    conditions: {
      conditions: [],
      count: 0,
      currentCondition: null,
      loading: false,
    },
    customActions: {
      actions: [],
      count: 0,
    },
    dndClasses: {
      dndClasses: [],
      count: 0,
      currentDndClass: null,
      loading: false,
    },
    items: {
      items: [],
      count: 0,
      currentItem: null,
      loading: false,
    },
    monsters: {
      monsters: [],
      monsterTypes: [],
      count: 0,
      currentMonster: null,
      loading: false,
    },
    races: {
      races: [],
      count: 0,
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
      count: 0,
      currentSpell: null,
      loading: false,
    },
    users: {
      users: [],
      count: 0,
      currentUser: undefined,
      token: undefined,
    },
    widgets: {
      widget: null,
      widgets: [],
      count: 0,
    },
  },
});
// };
export type RootState = ReturnType<typeof store.getState>;

export default store;
