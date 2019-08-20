import {createAction, createReducer} from 'redux-starter-kit';

const loginSucceeded = createAction('@@redux-api@userLogin_success');
const loginFailed = createAction('@@redux-api@userLogin_fail');

const logoutSucceeded = createAction('@@redux-api@userLogout_success');
const logoutFailed = createAction('@@redux-api@userLogout_fail');

const user = createReducer({}, {
  [loginSucceeded]: (state, action) => action.data,
  [loginFailed]: (state, action) => action.data,
  [logoutSucceeded]: () => null,
  [logoutFailed]: (state, action) => action.data,
  // [userUpdate]: (state) => {
  //   state.error = null;
  // },
  // [userUpdateSucceeded]: (state, action) => {
  //   state.user = action.payload.user;
  //   state.isLoading = false;
  //   state.error = null;
  // },
  // [userUpdateFailed]: (state, action) => {
  //   state.isLoading = false;
  //   state.error = action.payload;
  // },
});

export default user;