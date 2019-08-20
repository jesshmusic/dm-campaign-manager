import { createAction } from 'redux-starter-kit';

const loginUser = createAction('user/loginUser');
const loginSucceeded = createAction('user/loginSucceeded');
const loginFailed = createAction('user/loginFailed');

const logoutUser = createAction('user/logoutUser');
const logoutSucceeded = createAction('user/loginSucceeded');
const logoutFailed = createAction('user/loginFailed');