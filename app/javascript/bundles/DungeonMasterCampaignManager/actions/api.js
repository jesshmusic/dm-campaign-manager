import ReactOnRails from 'react-on-rails';
import reduxApi from 'redux-api';
import adapterFetch from 'redux-api/lib/adapters/fetch';
import { navigate } from '@reach/router';

function getHeaders (contentType) {
  return ReactOnRails.authenticityHeaders({
    'Content-Type': contentType ? contentType : 'application/json',
    'Accept': 'application/json',
  });
}

export default reduxApi({
  joinCampaign: {
    url: '/v1/campaigns/:id/join_campaign/:user_id',
    options () {
      const headers = getHeaders();
      return {
        method: 'patch',
        headers,
      };
    },
  },
  getCampaign: {
    url: '/v1/campaigns/:slug',
    options () {
      const headers = getHeaders();
      return {
        method: 'get',
        headers,
      };
    },
  },
  getCampaigns: {
    url: '/v1/campaigns',
    options () {
      const headers = getHeaders();
      return {
        method: 'get',
        headers,
      };
    },
  },
  getItem: {
    url: '/v1/items/:slug',
    options () {
      const headers = getHeaders();
      return {
        method: 'get',
        headers,
      };
    },
  },
  getItems: {
    url: '/v1/items',
    options () {
      const headers = getHeaders();
      return {
        method: 'get',
        headers,
      };
    },
  },
  getMonster: {
    url: '/v1/monsters/:slug',
    options () {
      const headers = getHeaders();
      return {
        method: 'get',
        headers,
      };
    },
  },
  getMonsters: {
    url: '/v1/monsters',
    options () {
      const headers = getHeaders();
      return {
        method: 'get',
        headers,
      };
    },
  },
  getUser: {
    url: '/users/:slug',
    options () {
      const headers = getHeaders();
      return {
        method: 'get',
        headers,
      };
    },
  },
  getUsers: {
    url: '/users',
    options () {
      const headers = getHeaders();
      return {
        method: 'get',
        headers,
      };
    },
  },
  userLogin: {
    url: '/users/sign_in',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
    postfetch: [() => {
      navigate('/');
    }],
  },
  userLogout: {
    url: '/users/sign_out',
    options () {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
    postfetch: [() => {
      navigate('/');
    }],
  },
}).use('fetch', adapterFetch(fetch));