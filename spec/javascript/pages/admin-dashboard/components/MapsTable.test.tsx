import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, waitFor, fireEvent } from '../../../test-utils';
import { MemoryRouter } from 'react-router-dom';
import MapsTable from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/components/MapsTable';

// Mock DataTable to avoid DndSpinner and other complex component issues
jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DataTable/DataTable',
  () => {
    return function MockDataTable({
      data,
      onSearch,
      loading,
    }: {
      data: Array<{
        id: string;
        name: string;
        tags: string[];
        access: string;
        published: boolean;
        thumbnail?: string;
      }>;
      onSearch: (term: string) => void;
      loading: boolean;
    }) {
      if (loading) {
        return <div data-testid="loading">Loading...</div>;
      }
      return (
        <div data-testid="mock-data-table">
          <input
            data-testid="search-input"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search"
          />
          <table>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} data-testid={`row-${row.id}`}>
                  <td>
                    {row.thumbnail ? (
                      <img src={row.thumbnail} alt={row.name} data-testid={`thumb-${row.id}`} />
                    ) : (
                      <span data-testid={`no-thumb-${row.id}`}>No img</span>
                    )}
                  </td>
                  <td data-testid={`name-${row.id}`}>{row.name}</td>
                  <td data-testid={`tags-${row.id}`}>{row.tags?.slice(0, 3).join(', ') || '-'}</td>
                  <td data-testid={`access-${row.id}`}>{row.access}</td>
                  <td data-testid={`status-${row.id}`}>
                    {row.published ? 'Published' : 'Draft'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div data-testid="results-count">{data.length} results</div>
        </div>
      );
    };
  },
);

// Mock fetch
const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
global.fetch = mockFetch;

const mockMaps = [
  {
    id: '1',
    name: 'Test Map 1',
    thumbnail: 'https://example.com/thumb1.jpg',
    access: 'Free',
    published: true,
    tags: ['Cave', 'Dungeon'],
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    name: 'Test Map 2',
    thumbnail: null,
    access: 'Premium',
    published: false,
    tags: ['Forest', 'Outdoor', 'River'],
    createdAt: '2024-01-02T00:00:00Z',
  },
];

const renderMapsTable = () => {
  return render(
    <MemoryRouter>
      <MapsTable />
    </MemoryRouter>,
  );
};

describe('MapsTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockMaps,
    } as Response);
  });

  describe('rendering', () => {
    it('should fetch and display maps on mount', async () => {
      renderMapsTable();

      await waitFor(() => {
        expect(screen.getByTestId('name-1')).toHaveTextContent('Test Map 1');
      });

      expect(screen.getByTestId('name-2')).toHaveTextContent('Test Map 2');
    });

    it('should display map names', async () => {
      renderMapsTable();

      await waitFor(() => {
        expect(screen.getByTestId('name-1')).toHaveTextContent('Test Map 1');
        expect(screen.getByTestId('name-2')).toHaveTextContent('Test Map 2');
      });
    });

    it('should display tags (limited to 3)', async () => {
      renderMapsTable();

      await waitFor(() => {
        expect(screen.getByTestId('tags-1')).toHaveTextContent('Cave, Dungeon');
        expect(screen.getByTestId('tags-2')).toHaveTextContent('Forest, Outdoor, River');
      });
    });

    it('should display access level', async () => {
      renderMapsTable();

      await waitFor(() => {
        expect(screen.getByTestId('access-1')).toHaveTextContent('Free');
        expect(screen.getByTestId('access-2')).toHaveTextContent('Premium');
      });
    });

    it('should display published status', async () => {
      renderMapsTable();

      await waitFor(() => {
        expect(screen.getByTestId('status-1')).toHaveTextContent('Published');
        expect(screen.getByTestId('status-2')).toHaveTextContent('Draft');
      });
    });

    it('should display thumbnail image when available', async () => {
      renderMapsTable();

      await waitFor(() => {
        const img = screen.getByTestId('thumb-1');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', 'https://example.com/thumb1.jpg');
      });
    });

    it('should display placeholder when no thumbnail', async () => {
      renderMapsTable();

      await waitFor(() => {
        expect(screen.getByTestId('no-thumb-2')).toHaveTextContent('No img');
      });
    });
  });

  describe('API calls', () => {
    it('should call fetch on mount', async () => {
      renderMapsTable();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/v1/maps', {
          headers: {
            Accept: 'application/json',
          },
        });
      });
    });
  });

  describe('search functionality', () => {
    it('should filter maps when searching', async () => {
      renderMapsTable();

      await waitFor(() => {
        expect(screen.getByTestId('name-1')).toBeInTheDocument();
      });

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'Test Map 1' } });

      // Wait for filtered results
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledTimes(2); // Initial + search
      });
    });
  });

  describe('empty state', () => {
    it('should handle empty maps list', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => [],
      } as Response);

      renderMapsTable();

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalled();
      });

      expect(screen.queryByTestId('name-1')).not.toBeInTheDocument();
      expect(screen.getByTestId('results-count')).toHaveTextContent('0 results');
    });
  });

  describe('error handling', () => {
    it('should handle fetch error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
      mockFetch.mockRejectedValue(new Error('Network error'));

      renderMapsTable();

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Error fetching maps:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('loading state', () => {
    it('should show loading state initially', async () => {
      // Use a promise that doesn't resolve immediately
      let resolvePromise: (value: Response) => void;
      const promise = new Promise<Response>((resolve) => {
        resolvePromise = resolve;
      });
      mockFetch.mockReturnValue(promise);

      renderMapsTable();

      // Initially should show loading
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Resolve the promise
      resolvePromise!({
        ok: true,
        json: async () => mockMaps,
      } as Response);

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });
    });
  });
});
