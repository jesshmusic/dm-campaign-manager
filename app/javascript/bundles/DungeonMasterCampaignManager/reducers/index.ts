import { combineReducers } from 'redux';
import conditions from './conditions';
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

export default combineReducers({
  conditions,
  customActions,
  dndClasses,
  flashMessages,
  items,
  monsters,
  races,
  rules,
  spells,
  users,
  widgets,
});
