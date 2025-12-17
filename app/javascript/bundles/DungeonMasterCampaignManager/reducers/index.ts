import { combineReducers } from 'redux';
import dndClasses from './dndClasses';
import flashMessages from './flashMessages';
import items from './items';
import monsters from './monsters';
import races from './races';
import rules from './rules';
import spells from './spells';
import users from './user';
import customActions from './customActions';
import widgets from './widgets';
import search from './search';

export default combineReducers({
  customActions,
  dndClasses,
  flashMessages,
  items,
  monsters,
  races,
  rules,
  search,
  spells,
  users,
  widgets,
});
