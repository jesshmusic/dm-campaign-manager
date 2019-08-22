import {createAction, createReducer} from 'redux-starter-kit';

const loginSucceeded = createAction('@@redux-api@userLogin_success');
const logoutSucceeded = createAction('@@redux-api@userLogout_success');

const getUsersSuccess = createAction('@@redux-api@getUsers_success');
const getUsersFail = createAction('@@redux-api@getUsers_fail');
const getUserSuccess = createAction('@@redux-api@getUser_success');
const getUserFail = createAction('@@redux-api@getUser_fail');

const users = createReducer({
  user: null,
  users: [],
  currentUser: null,
}, {
  [loginSucceeded]: (state, action) => {
    return {
      user: action.data,
      users: [],
      currentUser: null,
    };
  },
  [logoutSucceeded]: () => null,
  [getUsersSuccess]: (state, action) => {
    return {
      user: state.user,
      users: action.data.data,
      currentUser: state.currentUser,
    };
  },
  [getUsersFail]: () => [],
  [getUserSuccess]: (state, action) => {
    return {
      user: state.user,
      users: state.users,
      currentUser: action.data,
    };
  },
  [getUserFail]: () => [],
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

export default users;