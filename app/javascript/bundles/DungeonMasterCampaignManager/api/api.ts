import ReactOnRails from 'react-on-rails';
import reduxApi from 'redux-api';
import { navigate } from '@reach/router';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export function getHeaders() {
  return ReactOnRails.authenticityHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
}

const processData = (data) => {
  try {
    return JSON.parse(data);
  } catch (err) {
    return data;
  }
};

const toJSON = (resp) => {
  if (resp.text) {
    return resp.text().then(processData);
  } else if (resp instanceof Promise) {
    return resp.then(processData);
  }
  return Promise.resolve(resp).then(processData);
};

export const fetchData = (opts: AxiosRequestConfig): Promise<AxiosResponse> => {
  const headers = getHeaders();
  return axios({
    method: opts.method,
    url: opts.url,
    data: opts.data,
    headers,
  });
};

const dmFetch = (fetch) => {
  return (url, opts) => {
    if (opts.token) {
      opts.headers['Authorization'] = `Bearer ${opts.token}`;
    }
    return fetch(url, opts).then((response) => {
      const status = response.status === 1223 ? 204 : response.status;
      const statusText =
        response.status === 1223 ? 'No Content' : response.statusText;

      return toJSON(response).then((data) => {
        if (status >= 200 && status < 400) {
          return data;
        }
        data.status = status;
        data.statusText = statusText;
        return Promise.reject(data);
      });
    });
  };
};

export default reduxApi({
  generateMonster: {
    url: '/v1/generate_monster',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  convert2eNonPlayerCharacter: {
    url: '/v1/convert_2e_monster.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  generateCommoner: {
    url: '/v1/generate_commoner.json?random_monster_gender=:gender&random_monster_race=:race',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  getCondition: {
    url: '/v1/conditions/:slug',
  },
  getConditions: {
    url: '/v1/conditions.json',
  },
  getDndClass: {
    url: '/v1/dnd_classes/:slug.json',
  },
  getDndClasses: {
    url: '/v1/dnd_classes.json',
  },
  getItem: {
    url: '/v1/items/:slug.json',
  },
  getItems: {
    url: '/v1/items.json',
  },
  getMonster: {
    url: '/v1/monsters/:slug.json',
  },
  getMonsters: {
    url: '/v1/monsters.json',
  },
  getMonsterCategories: {
    url: '/v1/monster-categories.json',
  },
  getRace: {
    url: '/v1/races/:slug.json',
  },
  getRaces: {
    url: '/v1/races.json',
  },
  getSection: {
    url: '/v1/sections/:slug.json',
  },
  getSections: {
    url: '/v1/sections.json',
  },
  getSpell: {
    url: '/v1/spells/:slug.json',
  },
  getSpells: {
    url: '/v1/spells.json',
  },
  getUser: {
    url: '/users/:slug.json',
  },
  getUsers: {
    url: '/users.json',
  },
  setUser: {
    url: '/users/set_user.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  userLogin: {
    url: '/users/sign_in',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
    postfetch: [
      () => {
        navigate('/');
      },
    ],
  },
  userLogout: {
    url: '/users/sign_out',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
    postfetch: [
      () => {
        navigate('/');
      },
    ],
  },
})
  .use('options', (url, params, getState) => {
    const state = getState();
    console.log(state);
    const token = state.users && state.users.token ? state.users.token : null;
    const railsHeaders = getHeaders();
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...railsHeaders,
    };
    if (token) {
      const newHeaders = { ...headers, Authorization: `Bearer ${token}` };
      console.log(newHeaders);
      return {
        headers: newHeaders,
      };
    }
    return { headers };
  })
  .use('fetch', dmFetch(fetch));
