import { getHeaders, fetchData } from '../../../app/javascript/bundles/DungeonMasterCampaignManager/api/api';
import axios from 'axios';

jest.mock('react-on-rails', () => ({
  authenticityHeaders: jest.fn((headers) => headers),
}));

jest.mock('axios');
jest.mock('redux-api', () => {
  return jest.fn(() => ({
    use: jest.fn().mockReturnThis(),
  }));
});

const mockedAxios = axios as jest.Mocked<typeof axios>;

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
    beforeEach(() => {
      mockedAxios.mockClear();
    });

    it('is a function', () => {
      expect(typeof fetchData).toBe('function');
    });

    it('calls axios with correct parameters for GET request', async () => {
      const mockResponse = { data: { test: 'data' } };
      (mockedAxios as any).mockResolvedValue(mockResponse);

      const opts = {
        method: 'GET',
        url: '/test-url',
      };

      await fetchData(opts);

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test-url',
        data: undefined,
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }),
      });
    });

    it('calls axios with correct parameters for POST request', async () => {
      const mockResponse = { data: { success: true } };
      (mockedAxios as any).mockResolvedValue(mockResponse);

      const opts = {
        method: 'POST',
        url: '/api/create',
        data: { name: 'test' },
      };

      await fetchData(opts);

      expect(mockedAxios).toHaveBeenCalledWith({
        method: 'POST',
        url: '/api/create',
        data: { name: 'test' },
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
      });
    });

    it('includes headers from getHeaders', async () => {
      const mockResponse = { data: {} };
      (mockedAxios as any).mockResolvedValue(mockResponse);

      await fetchData({ method: 'GET', url: '/test' });

      const callArgs = (mockedAxios as any).mock.calls[0][0];
      expect(callArgs.headers).toHaveProperty('Content-Type');
      expect(callArgs.headers).toHaveProperty('Accept');
    });

    it('returns axios response', async () => {
      const mockResponse = { data: { result: 'success' }, status: 200 };
      (mockedAxios as any).mockResolvedValue(mockResponse);

      const result = await fetchData({ method: 'GET', url: '/test' });

      expect(result).toEqual(mockResponse);
    });

    it('handles PUT requests', async () => {
      const mockResponse = { data: { updated: true } };
      (mockedAxios as any).mockResolvedValue(mockResponse);

      const opts = {
        method: 'PUT',
        url: '/api/update/1',
        data: { name: 'updated' },
      };

      await fetchData(opts);

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: '/api/update/1',
        })
      );
    });

    it('handles DELETE requests', async () => {
      const mockResponse = { data: { deleted: true } };
      (mockedAxios as any).mockResolvedValue(mockResponse);

      const opts = {
        method: 'DELETE',
        url: '/api/delete/1',
      };

      await fetchData(opts);

      expect(mockedAxios).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: '/api/delete/1',
        })
      );
    });
  });
});
