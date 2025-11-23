import React from 'react';
import { render, screen } from '@testing-library/react';
import GenMonsterSection from '../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/GenMonsterSection';

describe('GenMonsterSection', () => {
  it('renders without crashing', () => {
    render(
      <GenMonsterSection heading="Test Section">
        <div>Content</div>
      </GenMonsterSection>
    );
  });

  it('displays heading', () => {
    render(
      <GenMonsterSection heading="Stats">
        <div>Content</div>
      </GenMonsterSection>
    );
    expect(screen.getByText('Stats')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <GenMonsterSection heading="Test">
        <div>Test Content</div>
      </GenMonsterSection>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders heading as h4 element', () => {
    render(
      <GenMonsterSection heading="My Heading">
        <div>Content</div>
      </GenMonsterSection>
    );
    const heading = screen.getByText('My Heading');
    expect(heading.tagName).toBe('H4');
  });
});
