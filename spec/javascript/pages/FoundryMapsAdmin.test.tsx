import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

global.fetch = jest.fn();

const mockQuill = {
  import: jest.fn(() => ({})),
  register: jest.fn(),
};

jest.mock('react-quill', () => {
  const mockQuill = {
    import: jest.fn(() => ({})),
    register: jest.fn(),
  };
  const QuillComponent = function MockReactQuill() {
    return <div data-testid="react-quill">Editor</div>;
  };
  (QuillComponent as any).Quill = mockQuill;
  return {
    __esModule: true,
    default: QuillComponent,
    Quill: mockQuill,
  };
});

jest.mock('quill-image-resize-module-react', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('react-icons/gi', () => ({
  GiSave: () => <span>Save</span>,
}));

jest.mock('react-icons/all', () => ({
  GiLinkedRings: () => <span>Spinner</span>,
}));

jest.mock('react-icons/md', () => ({
  MdEdit: () => <span>Edit</span>,
  MdDelete: () => <span>Delete</span>,
  MdVisibility: () => <span>View</span>,
  MdSave: () => <span>Save</span>,
  MdCancel: () => <span>Cancel</span>,
}));

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer', () => {
  return function MockPageContainer({ children }: any) {
    return <div data-testid="page-container">{children}</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle', () => {
  return function MockPageTitle({ title }: any) {
    return <h1 data-testid="page-title">{title}</h1>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Alerts/FlashMessages', () => {
  return function MockFlashMessages() {
    return <div data-testid="flash-messages">Flash Messages</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick }: any) {
    return <button data-testid={`button-${title}`} onClick={onClick}>{title}</button>;
  };
});

import FoundryMapsAdmin from '../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/FoundryMapsAdmin';

const mockStore = configureStore({
  reducer: {
    flashMessages: () => [],
  },
});

describe('FoundryMapsAdmin', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('renders loading state', () => {
    (global.fetch as jest.Mock).mockImplementation(() =>
      new Promise(() => {}) // Never resolves to keep loading state
    );

    render(
      <Provider store={mockStore}>
        <FoundryMapsAdmin />
      </Provider>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders page title', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/v1/maps') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      if (url === '/v1/map-tags') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <Provider store={mockStore}>
        <FoundryMapsAdmin />
      </Provider>
    );

    await screen.findByTestId('page-title');
    expect(screen.getByTestId('page-title')).toHaveTextContent('Foundry Maps Admin');
  });

  it('fetches maps and tags on mount', async () => {
    (global.fetch as jest.Mock).mockImplementation((url) => {
      if (url === '/v1/maps') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      if (url === '/v1/map-tags') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve([]),
        });
      }
      return Promise.reject(new Error('Unknown URL'));
    });

    render(
      <Provider store={mockStore}>
        <FoundryMapsAdmin />
      </Provider>
    );

    await screen.findByTestId('page-title');

    expect(global.fetch).toHaveBeenCalledWith('/v1/maps', expect.any(Object));
    expect(global.fetch).toHaveBeenCalledWith('/v1/map-tags', expect.any(Object));
  });
});
