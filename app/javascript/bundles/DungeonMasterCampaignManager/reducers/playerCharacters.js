import {createAction, createReducer} from 'redux-starter-kit';

const getPlayerCharacters = createAction('@@redux-api@getPlayerCharacters');
const getPlayerCharactersSuccess = createAction('@@redux-api@getPlayerCharacters_success');
const getPlayerCharactersFail = createAction('@@redux-api@getPlayerCharacters_fail');
const getPlayerCharacter = createAction('@@redux-api@getPlayerCharacter');
const getPlayerCharacterSuccess = createAction('@@redux-api@getPlayerCharacter_success');
const getPlayerCharacterFail = createAction('@@redux-api@getPlayerCharacter_fail');
const newPlayerCharacter = createAction('@@redux-api@newPlayerCharacter');
const newPlayerCharacterSuccess = createAction('@@redux-api@newPlayerCharacter_success');
const newPlayerCharacterFail = createAction('@@redux-api@newPlayerCharacter_fail');
const createPlayerCharacterSuccess = createAction('@@redux-api@createPlayerCharacter_success');
const createPlayerCharacterFail = createAction('@@redux-api@createPlayerCharacter_fail');
const updatePlayerCharacterSuccess = createAction('@@redux-api@updatePlayerCharacter_success');
const updatePlayerCharacterFail = createAction('@@redux-api@updatePlayerCharacter_fail');

const playerCharacters = createReducer({
  characters: [],
  count: 0,
  currentCharacter: null,
}, {
  [getPlayerCharacters]: (state) => ({
    characters: [],
    count: state.count,
    currentCharacter: state.currentCharacter,
  }),
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
  [getPlayerCharacter]: (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
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
  [newPlayerCharacter]: (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
  }),
  [newPlayerCharacterSuccess]: (state, action) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: action.data,
  }),
  [newPlayerCharacterFail]: () => (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
  }),
  [createPlayerCharacterSuccess]: (state, action) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: action.data,
  }),
  [createPlayerCharacterFail]: () => (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
  }),
  [updatePlayerCharacterSuccess]: (state, action) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: action.data,
  }),
  [updatePlayerCharacterFail]: () => (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
  }),
});

export default playerCharacters;