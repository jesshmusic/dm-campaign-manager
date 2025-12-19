import React from 'react';
import { render, screen } from '../../test-utils';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Spell from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/spells/Spell';

jest.mock('react-router-dom', () => ({
  useParams: jest.fn(() => ({ spellSlug: 'fireball' })),
  useNavigate: jest.fn(),
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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner() {
    return <div data-testid="spinner">Loading...</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/InfoBlock/InfoBlock', () => {
  return function MockInfoBlock({ title, desc }: any) {
    return (
      <div data-testid={`info-block-${title}`}>
        <strong>{title}:</strong> {desc}
      </div>
    );
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared', () => ({
  AdminActions: () => null,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/spells/SpellFormModal', () => {
  return function MockSpellFormModal() {
    return null;
  };
});

describe('Spell', () => {
  it('shows spinner when spell is not loaded', () => {
    const mockStore = configureStore({
      reducer: {
        spells: () => ({
          currentSpell: null,
        }),
        users: () => ({
          currentUser: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Spell />
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('displays spell name when loaded', () => {
    const mockStore = configureStore({
      reducer: {
        spells: () => ({
          currentSpell: {
            name: 'Fireball',
            spellLevel: '3rd-level',
            school: 'Evocation',
            castingTime: '1 action',
            range: '150 feet',
            components: ['V', 'S', 'M'],
            material: 'a tiny ball of bat guano and sulfur',
            duration: 'Instantaneous',
            description: 'A bright streak flashes from your pointing finger...',
            higherLevel: 'When you cast this spell using a spell slot...',
          },
        }),
        users: () => ({
          currentUser: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Spell />
      </Provider>
    );

    expect(screen.getByTestId('page-title')).toHaveTextContent('Fireball');
  });

  it('displays spell details', () => {
    const mockStore = configureStore({
      reducer: {
        spells: () => ({
          currentSpell: {
            name: 'Fireball',
            spellLevel: '3rd-level',
            school: 'Evocation',
            castingTime: '1 action',
            range: '150 feet',
            components: ['V', 'S', 'M'],
            material: 'a tiny ball of bat guano and sulfur',
            duration: 'Instantaneous',
            description: 'A bright streak flashes from your pointing finger...',
            higherLevel: 'When you cast this spell using a spell slot...',
          },
        }),
        users: () => ({
          currentUser: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Spell />
      </Provider>
    );

    expect(screen.getByTestId('info-block-Casting Time')).toBeInTheDocument();
    expect(screen.getByTestId('info-block-Range')).toBeInTheDocument();
    expect(screen.getByTestId('info-block-Components')).toBeInTheDocument();
    expect(screen.getByTestId('info-block-Duration')).toBeInTheDocument();
  });

  it('displays spell description', () => {
    const mockStore = configureStore({
      reducer: {
        spells: () => ({
          currentSpell: {
            name: 'Fireball',
            spellLevel: '3rd-level',
            school: 'Evocation',
            castingTime: '1 action',
            range: '150 feet',
            components: ['V', 'S', 'M'],
            duration: 'Instantaneous',
            description: 'A bright streak flashes from your pointing finger...',
            higherLevel: 'When you cast this spell using a spell slot...',
          },
        }),
        users: () => ({
          currentUser: null,
        }),
      },
    });

    render(
      <Provider store={mockStore}>
        <Spell />
      </Provider>
    );

    expect(screen.getByText('A bright streak flashes from your pointing finger...')).toBeInTheDocument();
  });
});
