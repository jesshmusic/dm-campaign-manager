import React from 'react';
import { render, screen } from '../../test-utils';
import TurnActions from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/TurnActions';

describe('TurnActions', () => {
  it('renders without crashing', () => {
    render(<TurnActions />);
  });

  it('displays move action', () => {
    render(<TurnActions />);
    expect(screen.getByText('Move up to your speed')).toBeInTheDocument();
  });

  it('displays take action', () => {
    render(<TurnActions />);
    expect(screen.getByText('Take one action')).toBeInTheDocument();
  });

  it('displays communicate action', () => {
    render(<TurnActions />);
    expect(screen.getByText(/Communicate with speech, gesture, or both/)).toBeInTheDocument();
  });

  it('displays interact with object', () => {
    render(<TurnActions />);
    expect(screen.getByText(/Interact with one object/)).toBeInTheDocument();
  });

  it('renders as unordered list', () => {
    const { container } = render(<TurnActions />);
    const list = container.querySelector('ul');
    expect(list).toBeInTheDocument();
  });

  it('has four list items', () => {
    const { container } = render(<TurnActions />);
    const items = container.querySelectorAll('li');
    expect(items.length).toBe(4);
  });
});
