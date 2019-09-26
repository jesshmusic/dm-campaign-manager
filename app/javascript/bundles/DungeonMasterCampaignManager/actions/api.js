import ReactOnRails from 'react-on-rails';
import reduxApi from 'redux-api';
import {navigate} from '@reach/router';

function getHeaders (contentType) {
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
  getAdventure: {
    url: '/v1/campaigns/:campaign_slug/adventures/:id.json',
    prefetch: [
      ({actions, dispatch, getState, request}, cb) => {
        const {campaigns: {currentCampaign}} = getState();
        const {pathvars: {campaign_slug}} = request;
        currentCampaign !== null ? cb() :
          dispatch(actions.getCampaign({slug: campaign_slug}, cb));
      },
    ],
  },
  createAdventure: {
    url: '/v1/campaigns/:campaign_slug/adventures/',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
    postfetch: [({data}) => {
      navigate(`/app/campaigns/${data.campaign_slug}/advantures/${data.id}`);
    }],
  },
  updateAdventure: {
    url: '/v1/campaigns/:campaign_slug/adventures/:id',
    options () {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
    postfetch: [({data}) => {
      navigate(`/app/campaigns/${data.campaign_slug}/advantures/${data.id}`);
    }],
  },
  createCampaign: {
    url: '/v1/campaigns/',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
    postfetch: [({data}) => {
      navigate(`/app/campaigns/${data.slug}`);
    }],
  },
  updateCampaign: {
    url: '/v1/campaigns/:slug/',
    options () {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  getCampaign: {
    url: '/v1/campaigns/:slug.json',
  },
  getCampaigns: {
    url: '/v1/campaigns.json',
  },
  getEncounter: {
    url: '/v1/campaigns/:campaign_slug/adventures/:adventure_id/encounters/:id.json',
    prefetch: [
      ({actions, dispatch, getState, request}, cb) => {
        const {campaigns: {currentAdventure}} = getState();
        const {pathvars: {campaign_slug, adventure_id}} = request;
        currentAdventure !== null ? cb() :
          dispatch(actions.getAdventure({id: adventure_id, campaign_slug}, cb));
      },
    ],
  },
  createEncounter: {
    url: '/v1/campaigns/:campaign_slug/adventures/:adventure_id/encounters/',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
    postfetch: [({actions, dispatch, request}) => {
      const {pathvars: {campaign_slug, adventure_id}} = request;
      dispatch(actions.getCampaign({slug: campaign_slug}));
      dispatch(actions.getAdventure({id: adventure_id, campaign_slug}));
    }],
  },
  updateEncounter: {
    url: '/v1/campaigns/:campaign_slug/adventures/:adventure_id/encounters/:id',
    options () {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
    postfetch: [({actions, dispatch, request}) => {
      const {pathvars: {campaign_slug, adventure_id}} = request;
      dispatch(actions.getCampaign({slug: campaign_slug}));
      dispatch(actions.getAdventure({id: adventure_id, campaign_slug}));
    }],
  },
  createNonPlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/non_player_characters/',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
  },
  updateNonPlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/non_player_characters/:slug',
    options () {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  generateNonPlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/characters/create_generated_npc',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
    postfetch: [({data}) => {
      navigate(`/app/campaigns/${data.campaign.slug}/npcs/${data.slug}`);
    }],
  },
  getNonPlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/non_player_characters/:slug.json',
  },
  newNonPlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/non_player_characters/new.json',
  },
  getNonPlayerCharacters: {
    url: '/v1/campaigns/:campaign_slug/non_player_characters.json',
  },
  createPlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/player_characters/',
    options () {
      const headers = getHeaders();
      return {
        method: 'post',
        headers,
      };
    },
    postfetch: [({data}) => {
      navigate(`/app/campaigns/${data.campaign.slug}/pcs/${data.slug}`);
    }],
  },
  updatePlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/player_characters/:slug',
    options () {
      const headers = getHeaders();
      return {
        method: 'put',
        headers,
      };
    },
  },
  getPlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/player_characters/:slug.json',
  },
  newPlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/player_characters/new.json',
  },
  getPlayerCharacters: {
    url: '/v1/campaigns/:campaign_slug/player_characters.json',
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