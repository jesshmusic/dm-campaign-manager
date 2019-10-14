import {createAction, createReducer} from 'redux-starter-kit';

const getNonPlayerCharacters = createAction('@@redux-api@getNonPlayerCharacters');
const getNonPlayerCharactersSuccess = createAction('@@redux-api@getNonPlayerCharacters_success');
const getNonPlayerCharactersFail = createAction('@@redux-api@getNonPlayerCharacters_fail');
const getNonPlayerCharacterSuccess = createAction('@@redux-api@getNonPlayerCharacter_success');
const getNonPlayerCharacterFail = createAction('@@redux-api@getNonPlayerCharacter_fail');
const newNonPlayerCharacter = createAction('@@redux-api@newNonPlayerCharacter');
const newNonPlayerCharacterSuccess = createAction('@@redux-api@newNonPlayerCharacter_success');
const newNonPlayerCharacterFail = createAction('@@redux-api@newNonPlayerCharacter_fail');
const createNonPlayerCharacterSuccess = createAction('@@redux-api@createNonPlayerCharacter_success');
const createNonPlayerCharacterFail = createAction('@@redux-api@createNonPlayerCharacter_fail');
const updateNonPlayerCharacterSuccess = createAction('@@redux-api@updateNonPlayerCharacter_success');
const updateNonPlayerCharacterFail = createAction('@@redux-api@updateNonPlayerCharacter_fail');

const nonPlayerCharacters = createReducer({
  characters: [],
  count: 0,
  currentCharacter: null,
}, {
  [getNonPlayerCharacters]: (state) => ({
    characters: [],
    count: state.count,
    currentCharacter: state.currentCharacter,
  }),
  [getNonPlayerCharactersSuccess]: (state, action) => ({
    characters: action.data.data,
    count: state.count,
    currentCharacter: state.currentCharacter,
  }),
  [getNonPlayerCharactersFail]: (state) => ({
    characters: [],
    count: state.count,
    currentCharacter: state.currentCharacter,
  }),
  [getNonPlayerCharacterSuccess]: (state, action) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: action.data,
  }),
  [newNonPlayerCharacter]: (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
  }),
  [newNonPlayerCharacterSuccess]: (state, action) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: action.data,
  }),
  [newNonPlayerCharacterFail]: () => (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
  }),
  [createNonPlayerCharacterSuccess]: (state, action) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: action.data,
  }),
  [createNonPlayerCharacterFail]: () => (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
  }),
  [updateNonPlayerCharacterSuccess]: (state, action) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: action.data,
  }),
  [updateNonPlayerCharacterFail]: () => (state) => ({
    characters: state.characters,
    count: state.count,
    currentCharacter: null,
  }),
});

export default nonPlayerCharacters;