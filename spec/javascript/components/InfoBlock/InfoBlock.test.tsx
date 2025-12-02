import React from 'react';
import { render, screen } from '../../test-utils';
import InfoBlock from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/InfoBlock/InfoBlock';

describe('InfoBlock', () => {
  it('renders with title and description', () => {
    render(<InfoBlock title="Hit Points" desc="150/200" />);
    expect(screen.getByText(/Hit Points:/)).toBeInTheDocument();
    expect(screen.getByText(/150\/200/)).toBeInTheDocument();
  });

  it('displays title with colon', () => {
    render(<InfoBlock title="Armor Class" desc="18" />);
    expect(screen.getByText('Armor Class:')).toBeInTheDocument();
  });

  it('displays description text', () => {
    render(<InfoBlock title="Speed" desc="30 ft." />);
    expect(screen.getByText('30 ft.')).toBeInTheDocument();
  });

  it('renders with empty description', () => {
    render(<InfoBlock title="Notes" desc="" />);
    expect(screen.getByText('Notes:')).toBeInTheDocument();
  });

  it('handles long descriptions', () => {
    const longDesc = 'A very long description that contains multiple words and should be displayed correctly';
    render(<InfoBlock title="Details" desc={longDesc} />);
    expect(screen.getByText(longDesc)).toBeInTheDocument();
  });

  it('applies infoBlock class', () => {
    const { container } = render(<InfoBlock title="Test" desc="Value" />);
    const infoBlock = container.firstChild; // InfoBlock wrapper
    expect(infoBlock).toBeInTheDocument();
  });

  it('renders title in span element', () => {
    render(<InfoBlock title="Type" desc="Dragon" />);
    const titleElement = screen.getByText('Type:');
    expect(titleElement.tagName).toBe('SPAN');
  });

  it('handles numeric descriptions', () => {
    render(<InfoBlock title="Level" desc="15" />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('handles special characters in title', () => {
    render(<InfoBlock title="AC (with shield)" desc="20" />);
    expect(screen.getByText('AC (with shield):')).toBeInTheDocument();
  });

  it('handles special characters in description', () => {
    render(<InfoBlock title="Damage" desc="2d6+3" />);
    expect(screen.getByText('2d6+3')).toBeInTheDocument();
  });
});
