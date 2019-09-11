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
    postfetch: [({data}) => {
      navigate(`/app/campaigns/${data.slug}`);
    }],
  },
  getCampaign: {
    url: '/v1/campaigns/:slug.json',
  },
  getCampaigns: {
    url: '/v1/campaigns.json',
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
    postfetch: [({data}) => {
      navigate(`/app/characters/${data.slug}`);
    }],
  },
  getNonPlayerCharacter: {
    url: '/v1/campaigns/:campaign_slug/non_player_characters/:slug.json',
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
      navigate(`/app/characters/${data.slug}`);
    }],
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
}).use('fetch', adapterFetch(fetch));