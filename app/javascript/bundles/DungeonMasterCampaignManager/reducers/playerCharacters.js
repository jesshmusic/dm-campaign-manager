import { createReducer} from 'redux-starter-kit';

const playerCharacters = createReducer({
  characters: [],
  count: 0,
  currentCharacter: null,
}, {

});

export default playerCharacters;