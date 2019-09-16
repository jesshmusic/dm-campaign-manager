import {createAction, createReducer} from 'redux-starter-kit';

const getNonPlayerCharactersSuccess = createAction('@@redux-api@getNonPlayerCharacters_success');
const getNonPlayerCharactersFail = createAction('@@redux-api@getNonPlayerCharacters_fail');
const getNonPlayerCharacterSuccess = createAction('@@redux-api@getNonPlayerCharacter_success');
const getNonPlayerCharacterFail = createAction('@@redux-api@getNonPlayerCharacter_fail');
const newNonPlayerCharacterSuccess = createAction('@@redux-api@newNonPlayerCharacter_success');
const newNonPlayerCharacterFail = createAction('@@redux-api@newNonPlayerCharacter_fail');

const nonPlayerCharacters = createReducer({
  characters: [],
  count: 0,
  currentCharacter: null,
}, {
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
  [getNonPlayerCharacterFail]: () => (state) => ({
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
});

export default nonPlayerCharacters;