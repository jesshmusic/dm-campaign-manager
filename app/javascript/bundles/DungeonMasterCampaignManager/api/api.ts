import ReactOnRails from 'react-on-rails';
import reduxApi from 'redux-api';
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
      const statusText = response.status === 1223 ? 'No Content' : response.statusText;

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
  generateQuickMonster: {
    url: '/v1/quick_monster',
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
  getCustomActions: {
    url: '/v1/actions',
  },
  createCustomAction: {
    url: '/v1/actions',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateCustomAction: {
    url: '/v1/actions/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteCustomAction: {
    url: '/v1/actions/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
  getWidgets: {
    url: '/v1/widgets',
  },
  createWidget: {
    url: '/v1/widgets',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateWidget: {
    url: '/v1/widgets/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteWidget: {
    url: '/v1/widgets/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
  getCondition: {
    url: '/v1/conditions/:id',
  },
  getConditions: {
    url: '/v1/conditions.json',
  },
  getDndClass: {
    url: '/v1/dnd_classes/:id.json',
  },
  getDndClasses: {
    url: '/v1/dnd_classes.json',
  },
  getItem: {
    url: '/v1/items/:id.json',
  },
  getItems: {
    url: '/v1/items.json',
  },
  getMonster: {
    url: '/v1/monsters/:id.json',
  },
  getMonsters: {
    url: '/v1/monsters.json',
  },
  getMonsterCategories: {
    url: '/v1/monster-categories.json',
  },
  getRace: {
    url: '/v1/races/:id.json',
  },
  getRaces: {
    url: '/v1/races.json',
  },
  getSection: {
    url: '/v1/sections/:id.json',
  },
  getSections: {
    url: '/v1/sections.json',
  },
  getSpell: {
    url: '/v1/spells/:id.json',
  },
  getSpells: {
    url: '/v1/spells.json',
  },
  user: {
    url: '/users/:id.json',
    crud: true,
  },
  getUsers: {
    url: '/users.json',
  },
  login: {
    url: '/users/login.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  logout: {
    url: '/users/logout.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
})
  .use('options', (url, params, getState) => {
    const state = getState();
    const token = state.users && state.users.token ? state.users.token : null;
    const railsHeaders = getHeaders();
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...railsHeaders,
    };
    if (token) {
      const newHeaders = { ...headers, Authorization: `Bearer ${token}` };
      return {
        headers: newHeaders,
      };
    }
    return { headers };
  })
  .use('fetch', dmFetch(fetch));
