import ReactOnRails from 'react-on-rails';
import reduxApi from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';

function getHeaders (contentType) {
  return ReactOnRails.authenticityHeaders({
    'Content-Type': contentType ? contentType : 'application/json',
  });
}

export default reduxApi({
  getCampaigns: {
    url: '/v1/campaigns.json',
    options () {
      const headers = getHeaders();
      return {
        method: 'get',
        headers,
      };
    },
  },
  userLogin: {
    url: '/users/sign_in.json',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
    postfetch: [
      ({actions, dispatch}) => dispatch(actions.getCampaigns()),
    ],
  },
  userLogout: {
    url: '/users/sign_out.json',
    options () {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
}).use('fetch', adapterFetch(customFetch));

function status (response) {
  if (response.status >= 200 && response.status < 300) {
    return Promise.resolve(response);
  }
  return Promise.reject(new Error(response.statusText));
}

function json (response) {
  try {
    return JSON.parse(response);
  } catch (err) {
    return response;
  }
}

export function customFetch (url, options) {
  return fetch(url, options)
    .then(status)
    .then(json)
    .then((data) => data).catch((error) => error);
}

export function apiFetch (url, options) {
  return fetch(`/${url}`, options)
    .then((response) =>
      response.json().then((result) => ({
        result,
        response,
      }))
    ).then(({
      result,
      response,
    }) => ({
      result,
      response,
    })).catch((err) => err);
}