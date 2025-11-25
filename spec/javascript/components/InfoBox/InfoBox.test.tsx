import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import InfoBox from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/InfoBox/InfoBox';

const renderWithRouter = (component) => render(<MemoryRouter>{component}</MemoryRouter>);

describe('InfoBox', () => {
  it('renders with all counts', () => {
    renderWithRouter(<InfoBox monstersCount={100} itemsCount={200} spellsCount={300} />);

    expect(screen.getByText("Dungeon Master's Toolbox")).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('300')).toBeInTheDocument();
  });

  it('displays monsters count', () => {
    renderWithRouter(<InfoBox monstersCount={42} itemsCount={0} spellsCount={0} />);
    expect(screen.getByText('Monsters:')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
  });

  it('displays items count', () => {
    renderWithRouter(<InfoBox monstersCount={0} itemsCount={75} spellsCount={0} />);
    expect(screen.getByText('Equipment and Items:')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('handles zero counts', () => {
    renderWithRouter(<InfoBox monstersCount={0} itemsCount={0} spellsCount={0} />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBe(3); // All 3 counts show 0
  });

  it('handles large numbers', () => {
    renderWithRouter(<InfoBox monstersCount={9999} itemsCount={8888} spellsCount={7777} />);
    expect(screen.getByText('9999')).toBeInTheDocument();
    expect(screen.getByText('8888')).toBeInTheDocument();
  });

  it('renders inside Frame component', () => {
    const { container } = renderWithRouter(
      <InfoBox monstersCount={1} itemsCount={2} spellsCount={3} />
    );
    expect(container.querySelector('[class*="frame"]')).toBeInTheDocument();
  });

  it('renders list group structure', () => {
    const { container } = renderWithRouter(
      <InfoBox monstersCount={1} itemsCount={2} spellsCount={3} />
    );
    const listGroup = container.querySelector('.list-group');
    expect(listGroup).toBeInTheDocument();
  });
});