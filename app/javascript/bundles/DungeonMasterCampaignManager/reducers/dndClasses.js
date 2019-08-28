import {createAction, createReducer} from 'redux-starter-kit';

const getDndClassesSuccess = createAction('@@redux-api@getDndClasses_success');
const getDndClassesFail = createAction('@@redux-api@getDndClasses_fail');
const getDndClassSuccess = createAction('@@redux-api@getDndClass_success');
const getDndClassFail = createAction('@@redux-api@getDndClass_fail');

const dndClasses = createReducer({
  dndClasses: [],
  currentDndClass: null,
}, {
  [getDndClassesSuccess]: (state, action) => {
    return {
      dndClasses: action.data.data,
      currentDndClass: state.currentDndClass,
    };
  },
  [getDndClassesFail]: (state) => {
    return {
      dndClasses: state.dndClasses,
      currentDndClass: state.currentDndClass,
    };
  },
  [getDndClassSuccess]: (state, action) => {
    return {
      dndClasses: state.dndClasses,
      currentDndClass: action.data,
    };
  },
  [getDndClassFail]: () => (state) => {
    return {
      dndClasses: state.dndClasses,
      currentDndClass: null,
    };
  },
});

export default dndClasses;