import React from 'react';
import { render, screen } from '../../test-utils';
import ActionsInCombat from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/ActionsInCombat';

describe('ActionsInCombat', () => {
  it('renders without crashing', () => {
    render(<ActionsInCombat />);
  });

  it('displays Attack action', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Attack')).toBeInTheDocument();
  });

  it('displays Cast a Spell action', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Cast a Spell')).toBeInTheDocument();
  });

  it('displays Dash action', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Dash')).toBeInTheDocument();
  });

  it('displays Disengage action', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Disengage')).toBeInTheDocument();
  });

  it('displays Dodge action', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Dodge')).toBeInTheDocument();
  });

  it('displays Help action', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  it('displays Hide action', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Hide')).toBeInTheDocument();
  });

  it('displays Ready an Action', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Ready an Action')).toBeInTheDocument();
  });

  it('displays Search action', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Search')).toBeInTheDocument();
  });

  it('displays Use a Magic Item', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Use a Magic Item')).toBeInTheDocument();
  });

  it('displays Use an Object', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Use an Object')).toBeInTheDocument();
  });

  it('displays Use a Special Ability', () => {
    render(<ActionsInCombat />);
    expect(screen.getByText('Use a Special Ability')).toBeInTheDocument();
  });

  it('renders all actions content', () => {
    const { container } = render(<ActionsInCombat />);
    // Verify the widget has rendered with content by checking multiple actions exist
    expect(screen.getByText('Attack')).toBeInTheDocument();
    expect(screen.getByText('Cast a Spell')).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });
});
