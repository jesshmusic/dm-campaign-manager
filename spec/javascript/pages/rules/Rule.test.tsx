import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import Rule from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/Rule';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(() => ({ ruleSlug: 'combat' })),
}));

jest.mock('react-icons/all', () => ({
  GiBarbute: () => <svg data-testid="barbute-icon" />,
}));

jest.mock('react-icons/gi', () => ({
  GiDragonBreath: () => <svg data-testid="dragon-breath-icon" />,
}));

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: any) {
    return <div>{children}</div>;
  };
});

jest.mock('remark-gfm', () => jest.fn());
jest.mock('rehype-slug', () => jest.fn());

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer', () => {
  return function MockPageContainer({ children }: any) {
    return <div data-testid="page-container">{children}</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/BreadcrumbContext', () => ({
  useBreadcrumbs: () => ({
    customPaths: undefined,
    setCustomPaths: jest.fn(),
  }),
}));

describe('Rule', () => {
  it('shows spinner when loading', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: null,
          loading: true,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Rule />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays rule content when loaded', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: {
            name: 'Combat',
            description: '## Combat Rules\n\nCombat is a key part of D&D.',
            rules: [],
          },
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Rule />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/Combat Rules/)).toBeInTheDocument();
  });

  it('displays sub-rules when available', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: {
            name: 'Combat',
            description: 'Combat rules',
            rules: [
              { name: 'Initiative', slug: 'initiative' },
              { name: 'Attacks', slug: 'attacks' },
            ],
          },
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Rule />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Initiative')).toBeInTheDocument();
    expect(screen.getByText('Attacks')).toBeInTheDocument();
  });

  it('displays navigation buttons when previous and next rules are available', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: {
            name: 'Combat',
            description: 'Combat rules',
            rules: [],
            previous_rule: { name: 'Character Creation', slug: 'character-creation' },
            next_rule: { name: 'Spellcasting', slug: 'spellcasting' },
          },
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Rule />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Character Creation')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Spellcasting')).toBeInTheDocument();
  });

  it('displays only next button when no previous rule', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: {
            name: 'Introduction',
            description: 'First rule',
            rules: [],
            next_rule: { name: 'Combat', slug: 'combat' },
          },
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Rule />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Combat')).toBeInTheDocument();
  });

  it('displays only previous button when no next rule', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: {
            name: 'Appendix',
            description: 'Last rule',
            rules: [],
            previous_rule: { name: 'Combat', slug: 'combat' },
          },
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Rule />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Combat')).toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('does not display navigation when no previous or next rules', () => {
    const mockStore = configureStore({
      reducer: {
        rules: () => ({
          currentRule: {
            name: 'Only Rule',
            description: 'The only rule',
            rules: [],
          },
          loading: false,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Rule />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });
});
