import ReactOnRails from 'react-on-rails';
import reduxApi from 'redux-api';
import {navigate} from '@reach/router';

export function getHeaders (contentType) {
  return ReactOnRails.authenticityHeaders({
    'Content-Type': contentType ? contentType : 'application/json',
    'Accept': 'application/json',
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

const dmFetch = (fetch) => {
  return (url, opts) =>
    fetch(url, opts)
      .then((response) => {
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

export default reduxApi({
  generateNonPlayerCharacter: {
    url: '/v1/generate_npc',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  convert2eNonPlayerCharacter: {
    url: '/v1/convert_2e_npc',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  generateCommoner: {
    url: '/v1/generate_commoner?random_npc_gender=:gender&random_npc_race=:race',
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
  getNPC: {
    url: '/v1/monsters/:slug.json',
  },
  getNPCs: {
    url: '/v1/monsters.json',
  },
  getRace: {
    url: '/v1/race/:slug.json',
  },
  getRaces: {
    url: '/v1/races.json',
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
}).use('fetch', dmFetch(fetch));