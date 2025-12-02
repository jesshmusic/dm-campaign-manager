import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import MonsterGenerator from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/MonsterGenerator';

jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  event: jest.fn(),
}));

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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer', () => {
  return function MockPageContainer({ children }: any) {
    return <div data-testid="page-container">{children}</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle', () => {
  return function MockPageTitle({ title }: any) {
    return <h1 data-testid="page-title">{title}</h1>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/GenerateMonster', () => {
  return function MockGenerateMonster() {
    return <div data-testid="generate-monster">Generate Monster</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/Convert2eMonster', () => {
  return function MockConvert2eMonster() {
    return <div data-testid="convert-2e">Convert 2e</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/GenerateCommoner', () => {
  return function MockGenerateCommoner() {
    return <div data-testid="generate-commoner">Generate Commoner</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/MonsterBlock', () => ({
  __esModule: true,
  default: function MockMonsterBlock({ monster }: any) {
    return <div data-testid="monster-block">{monster?.name}</div>;
  },
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/quick-generate-monster/QuickGenerateMonster', () => {
  return function MockQuickGenerateMonster() {
    return <div data-testid="quick-generate">Quick Generate</div>;
  };
});

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
          generateCommoner={jest.fn()}
          generateMonster={jest.fn()}
          generateQuickMonster={jest.fn()}
        />
      </Provider>
    );
  });

  it('displays page title', () => {
    render(
      <Provider store={mockStore}>
        <MonsterGenerator
          monster={null}
          generateCommoner={jest.fn()}
          generateMonster={jest.fn()}
          generateQuickMonster={jest.fn()}
        />
      </Provider>
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('Monster Generators and Converters');
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
          monster={{ name: 'Goblin', size: 'Small' }}
          generateCommoner={jest.fn()}
          generateMonster={jest.fn()}
          generateQuickMonster={jest.fn()}
        />
      </Provider>
    );

    expect(screen.getByTestId('monster-block')).toHaveTextContent('Goblin');
  });
});
