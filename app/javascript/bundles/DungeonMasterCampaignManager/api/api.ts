import ReactOnRails from 'react-on-rails';
import reduxApi from 'redux-api';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const EDITION_STORAGE_KEY = 'dnd-edition';
const DEFAULT_EDITION = '2024';

/**
 * Get the current D&D edition from localStorage
 */
export function getCurrentEdition(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(EDITION_STORAGE_KEY) || DEFAULT_EDITION;
  }
  return DEFAULT_EDITION;
}

export function getHeaders() {
  return ReactOnRails.authenticityHeaders({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
}

const processData = (data: unknown): unknown => {
  try {
    return JSON.parse(data as string);
  } catch (_err) {
    return data;
  }
};

const toJSON = (resp: any): Promise<unknown> => {
  if (resp.text) {
    return resp.text().then(processData);
  } else if (resp instanceof Promise) {
    return resp.then(processData);
  }
  return Promise.resolve(resp).then(processData);
};

export const fetchData = (opts: AxiosRequestConfig): Promise<AxiosResponse> => {
  const headers = {
    ...getHeaders(),
    'X-DND-Edition': getCurrentEdition(),
  };
  return axios({
    method: opts.method,
    url: opts.url,
    data: opts.data,
    headers,
  });
};

const dmFetch = (fetch: any) => {
  return (url: string, opts: any) => {
    if (opts.token) {
      opts.headers['Authorization'] = `Bearer ${opts.token}`;
    }
    return fetch(url, opts).then((response: any) => {
      const status = response.status === 1223 ? 204 : response.status;
      const statusText = response.status === 1223 ? 'No Content' : response.statusText;

      return toJSON(response).then((data: any) => {
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
    url: '/v1/generate_commoner.json?random_monster_gender=:gender&random_monster_race=:race&role=:role&description=:description',
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
  getWidget: {
    url: '/v1/widgets/:id.json',
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
  getBackground: {
    url: '/v1/backgrounds/:id.json',
  },
  getBackgrounds: {
    url: '/v1/backgrounds.json',
  },
  createBackground: {
    url: '/v1/backgrounds',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateBackground: {
    url: '/v1/backgrounds/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteBackground: {
    url: '/v1/backgrounds/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
  getFeat: {
    url: '/v1/feats/:id.json',
  },
  getFeats: {
    url: '/v1/feats.json',
  },
  createFeat: {
    url: '/v1/feats',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateFeat: {
    url: '/v1/feats/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteFeat: {
    url: '/v1/feats/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
  getRule: {
    url: '/v1/rules/:id.json',
  },
  getRules: {
    url: '/v1/rules.json',
  },
  getSpell: {
    url: '/v1/spells/:id.json',
  },
  getSpells: {
    url: '/v1/spells.json',
  },
  createSpell: {
    url: '/v1/spells',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateSpell: {
    url: '/v1/spells/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteSpell: {
    url: '/v1/spells/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
  createItem: {
    url: '/v1/items',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateItem: {
    url: '/v1/items/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteItem: {
    url: '/v1/items/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
  createRace: {
    url: '/v1/races',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateRace: {
    url: '/v1/races/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteRace: {
    url: '/v1/races/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
  createRule: {
    url: '/v1/rules',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateRule: {
    url: '/v1/rules/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteRule: {
    url: '/v1/rules/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
  createMonster: {
    url: '/v1/monsters',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateMonster: {
    url: '/v1/monsters/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteMonster: {
    url: '/v1/monsters/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
  },
  createDndClass: {
    url: '/v1/dnd_classes',
    options() {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateDndClass: {
    url: '/v1/dnd_classes/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  deleteDndClass: {
    url: '/v1/dnd_classes/:id.json',
    options() {
      const headers = getHeaders();
      return {
        method: 'delete',
        headers,
      };
    },
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
  search: {
    url: '/v1/search.json?search=:searchString',
  },
})
  .use('options', (_url: any, _params: any, getState: any) => {
    const state = getState();
    const token = state.users && state.users.token ? state.users.token : null;
    const edition = getCurrentEdition();
    const railsHeaders = getHeaders();
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-DND-Edition': edition,
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
