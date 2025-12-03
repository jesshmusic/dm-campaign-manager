import React from 'react';
import { render, screen } from '../../test-utils';
import { MemoryRouter } from 'react-router-dom';
import NPCGenButton from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/NPCGenButton';

jest.mock('react-icons/all', () => ({
  GiBarbute: function MockIcon(props: any) { return <span>Icon</span>; },
}));

describe('NPCGenButton', () => {
  it('renders without crashing', () => {
    render(
      <MemoryRouter>
        <NPCGenButton />
      </MemoryRouter>
    );
  });

  it('displays NPC Generators text', () => {
    render(
      <MemoryRouter>
        <NPCGenButton />
      </MemoryRouter>
    );
    expect(screen.getByText('NPC Generators')).toBeInTheDocument();
  });

  it('links to monster-generator page', () => {
    render(
      <MemoryRouter>
        <NPCGenButton />
      </MemoryRouter>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/app/monster-generator');
  });
});
