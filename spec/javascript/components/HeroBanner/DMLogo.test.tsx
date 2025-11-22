import React from 'react';
import { render } from '@testing-library/react';
import DMLogo from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/HeroBanner/DMLogo';

describe('DMLogo', () => {
  it('renders SVG element', () => {
    const { container } = render(<DMLogo className="test-class" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<DMLogo className="custom-logo" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('custom-logo');
  });

  it('applies logo class', () => {
    const { container } = render(<DMLogo className="test" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveClass('logo');
  });

  it('has correct viewBox', () => {
    const { container } = render(<DMLogo className="test" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('viewBox', '0 0 1200 1200');
  });

  it('has height 100%', () => {
    const { container } = render(<DMLogo className="test" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('height', '100%');
  });

  it('contains path elements', () => {
    const { container } = render(<DMLogo className="test" />);
    const paths = container.querySelectorAll('path');
    expect(paths.length).toBeGreaterThan(0);
  });

  it('contains swords path', () => {
    const { container } = render(<DMLogo className="test" />);
    const swordsPath = container.querySelector('.swords');
    expect(swordsPath).toBeInTheDocument();
  });

  it('contains shield path', () => {
    const { container } = render(<DMLogo className="test" />);
    const shieldPath = container.querySelector('.shield');
    expect(shieldPath).toBeInTheDocument();
  });

  it('contains dnd path', () => {
    const { container } = render(<DMLogo className="test" />);
    const dndPath = container.querySelector('.dnd');
    expect(dndPath).toBeInTheDocument();
  });

  it('has xmlns attribute', () => {
    const { container } = render(<DMLogo className="test" />);
    const svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('xmlns', 'http://www.w3.org/2000/svg');
  });

  it('contains group elements', () => {
    const { container } = render(<DMLogo className="test" />);
    const groups = container.querySelectorAll('g');
    expect(groups.length).toBeGreaterThan(0);
  });
});
