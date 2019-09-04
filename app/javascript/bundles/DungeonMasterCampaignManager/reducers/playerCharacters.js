import {createAction, createReducer} from 'redux-starter-kit';

const getPlayerCharactersSuccess = createAction('@@redux-api@getPlayerCharacters_success');
const getPlayerCharactersFail = createAction('@@redux-api@getPlayerCharacters_fail');
const getPlayerCharacterSuccess = createAction('@@redux-api@getPlayerCharacter_success');
const getPlayerCharacterFail = createAction('@@redux-api@getPlayerCharacter_fail');

const playerCharacters = createReducer({
  characters: [],
  count: 0,
  currentCharacter: null,
}, {
  [getPlayerCharactersSuccess]: (state, action) => ({
    characters: action.data.data,
    count: state.count,
    currentCharacter: state.currentCharacter,
  }),
  [getPlayerCharactersFail]: (state) => ({
    characters: [],
    count: state.count,
    currentCharacter: state.currentCharacter,
  }),
  [getPlayerCharacterSuccess]: (state, action) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: action.data,
  }),
  [getPlayerCharacterFail]: () => (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
  }),
});

export default playerCharacters;