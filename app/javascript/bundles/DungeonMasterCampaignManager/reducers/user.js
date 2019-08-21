import {createAction, createReducer} from 'redux-starter-kit';

const loginSucceeded = createAction('@@redux-api@userLogin_success');

const logoutSucceeded = createAction('@@redux-api@userLogout_success');

const user = createReducer({}, {
  [loginSucceeded]: (state, action) => action.data,
  [logoutSucceeded]: () => null,
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