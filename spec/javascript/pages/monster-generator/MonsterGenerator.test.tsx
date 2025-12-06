import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MonsterGenerator from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/MonsterGenerator';

// Mock react-ga4
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  event: jest.fn(),
}));

// Mock radix-ui tabs
jest.mock('@radix-ui/react-tabs', () => ({
  Root: ({ children }: any) => <div data-testid="tabs-root">{children}</div>,
  List: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
  Trigger: ({ children }: any) => <button data-testid="tabs-trigger">{children}</button>,
  Content: ({ children }: any) => <div data-testid="tabs-content">{children}</div>,
}));

// Mock MonsterGenerator.styles - return styled divs
jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/MonsterGenerator.styles',
  () => ({
    MonsterGenWrapper: ({ children }: any) => (
      <div data-testid="monster-gen-wrapper">{children}</div>
    ),
    MonsterDisplayWrapper: ({ children }: any) => (
      <div data-testid="monster-display-wrapper">{children}</div>
    ),
    MonsterCloseButton: ({ children, onClick }: any) => (
      <button data-testid="monster-close-button" onClick={onClick}>
        {children}
      </button>
    ),
    TabsRoot: ({ children }: any) => <div data-testid="tabs-root">{children}</div>,
    TabsList: ({ children }: any) => <div data-testid="tabs-list">{children}</div>,
    TabsTrigger: ({ children }: any) => <button data-testid="tabs-trigger">{children}</button>,
    TabsContent: ({ children }: any) => <div data-testid="tabs-content">{children}</div>,
  }),
);

// Note: react-icons are mocked globally via moduleNameMapper in jest.config.js

// Mock api
jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/api/api', () => ({
  __esModule: true,
  default: {
    actions: {
      generateCommoner: jest.fn(),
      generateMonster: jest.fn(),
      generateQuickMonster: jest.fn(),
    },
  },
}));

// Mock PageContainer
jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer',
  () => {
    return function MockPageContainer({ children }: any) {
      return <div data-testid="page-container">{children}</div>;
    };
  },
);

// Mock PageTitle
jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle',
  () => {
    return function MockPageTitle({ title }: any) {
      return <h1 data-testid="page-title">{title}</h1>;
    };
  },
);

// Mock AIGenerateMonster
jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/ai-generate-monster/AIGenerateMonster',
  () => {
    return function MockAIGenerateMonster() {
      return <div data-testid="ai-generate-monster">AI Generate Monster</div>;
    };
  },
);

// Mock Convert2eMonster
jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/Convert2eMonster',
  () => {
    return function MockConvert2eMonster() {
      return <div data-testid="convert-2e">Convert 2e</div>;
    };
  },
);

// Mock GenerateCommoner
jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/GenerateCommoner',
  () => {
    return function MockGenerateCommoner() {
      return <div data-testid="generate-commoner">Generate Commoner</div>;
    };
  },
);

// Mock MonsterBlock
jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/MonsterBlock',
  () => ({
    __esModule: true,
    default: function MockMonsterBlock({ monster }: any) {
      return <div data-testid="monster-block">{monster?.name}</div>;
    },
  }),
);

// Mock QuickGenerateMonster
jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/quick-generate-monster/QuickGenerateMonster',
  () => {
    return function MockQuickGenerateMonster() {
      return <div data-testid="quick-generate">Quick Generate</div>;
    };
  },
);

// Mock reducers
jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/monsters',
  () => ({
    clearCurrentMonster: jest.fn(() => ({ type: 'CLEAR_MONSTER' })),
    setCurrentMonster: jest.fn((monster) => ({ type: 'SET_MONSTER', payload: monster })),
  }),
);

const mockStore = configureStore({
  reducer: {
    monsters: () => ({
      generatedMonster: null,
      currentMonster: null,
      loading: false,
    }),
    users: () => ({
      currentUser: null,
      token: null,
    }),
  },
});

describe('MonsterGenerator', () => {
  it('renders without crashing', () => {
    render(
      <Provider store={mockStore}>
        <MonsterGenerator
          monster={null}
          clearMonster={jest.fn()}
          setMonster={jest.fn()}
          generateCommoner={jest.fn()}
          generateQuickMonster={jest.fn()}
        />
      </Provider>,
    );
  });

  it('displays page title', () => {
    render(
      <Provider store={mockStore}>
        <MonsterGenerator
          monster={null}
          clearMonster={jest.fn()}
          setMonster={jest.fn()}
          generateCommoner={jest.fn()}
          generateQuickMonster={jest.fn()}
        />
      </Provider>,
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('NPC & Creature Generators');
  });

  it('displays generated monster when provided', () => {
    const storeWithMonster = configureStore({
      reducer: {
        monsters: () => ({
          generatedMonster: null,
          currentMonster: { name: 'Goblin', size: 'Small' },
          loading: false,
        }),
        users: () => ({
          currentUser: null,
          token: null,
        }),
      },
    });

    render(
      <Provider store={storeWithMonster}>
        <MonsterGenerator
          monster={{ name: 'Goblin', size: 'Small' } as any}
          clearMonster={jest.fn()}
          setMonster={jest.fn()}
          generateCommoner={jest.fn()}
          generateQuickMonster={jest.fn()}
        />
      </Provider>,
    );

    expect(screen.getByTestId('monster-block')).toHaveTextContent('Goblin');
  });
});
