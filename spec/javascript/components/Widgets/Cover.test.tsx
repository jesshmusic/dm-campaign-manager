import React from 'react';
import { render, screen } from '../../test-utils';
import Cover from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/Cover';

describe('Cover', () => {
  it('renders without crashing', () => {
    render(<Cover />);
  });

  it('renders table with headers', () => {
    render(<Cover />);
    expect(screen.getByText('Cover')).toBeInTheDocument();
    expect(screen.getByText('Effect')).toBeInTheDocument();
  });

  it('displays half cover', () => {
    render(<Cover />);
    expect(screen.getByText('Half cover')).toBeInTheDocument();
    expect(screen.getByText('+2 bonus to AC and Dexterity saving throws')).toBeInTheDocument();
  });

  it('displays three-quarters cover', () => {
    render(<Cover />);
    expect(screen.getByText('Three-quarters cover')).toBeInTheDocument();
    expect(screen.getByText('+5 bonus to AC and Dexterity saving throws')).toBeInTheDocument();
  });

  it('displays total cover', () => {
    render(<Cover />);
    expect(screen.getByText('Total cover')).toBeInTheDocument();
    expect(screen.getByText(/Can't be targeted/)).toBeInTheDocument();
  });

  it('has table structure', () => {
    const { container } = render(<Cover />);
    const table = container.querySelector('table');
    expect(table).toBeInTheDocument();
  });

  it('has thead element', () => {
    const { container } = render(<Cover />);
    const thead = container.querySelector('thead');
    expect(thead).toBeInTheDocument();
  });

  it('has tbody element', () => {
    const { container } = render(<Cover />);
    const tbody = container.querySelector('tbody');
    expect(tbody).toBeInTheDocument();
  });

  it('has three rows in tbody', () => {
    const { container } = render(<Cover />);
    const rows = container.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });
});
