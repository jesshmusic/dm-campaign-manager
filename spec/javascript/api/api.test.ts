import { getHeaders, fetchData } from '../../../app/javascript/bundles/DungeonMasterCampaignManager/api/api';

jest.mock('react-on-rails', () => ({
  authenticityHeaders: jest.fn((headers) => headers),
}));

jest.mock('axios');

describe('api', () => {
  describe('getHeaders', () => {
    it('returns headers object', () => {
      const headers = getHeaders();
      expect(headers).toHaveProperty('Content-Type');
      expect(headers).toHaveProperty('Accept');
    });

    it('includes application/json content type', () => {
      const headers = getHeaders();
      expect(headers['Content-Type']).toBe('application/json');
    });

    it('includes application/json accept', () => {
      const headers = getHeaders();
      expect(headers['Accept']).toBe('application/json');
    });
  });

  describe('fetchData', () => {
    it('is a function', () => {
      expect(typeof fetchData).toBe('function');
    });
  });
});
