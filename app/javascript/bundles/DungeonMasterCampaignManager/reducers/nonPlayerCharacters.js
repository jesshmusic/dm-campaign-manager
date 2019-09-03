import { createReducer} from 'redux-starter-kit';

const nonPlayerCharacters = createReducer({
  characters: [],
  count: 0,
  currentCharacter: null,
}, {

});

export default nonPlayerCharacters;