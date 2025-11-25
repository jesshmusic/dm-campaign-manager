import React from 'react';
import { render } from '@testing-library/react';
import CustomWidget from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/CustomWidget';

describe('CustomWidget', () => {
  it('renders without crashing', () => {
    render(<CustomWidget content="<p>Test</p>" />);
  });

  it('renders HTML content', () => {
    const { container } = render(<CustomWidget content="<p>Test Content</p>" />);
    expect(container.innerHTML).toContain('<p>Test Content</p>');
  });

  it('renders complex HTML', () => {
    const { container } = render(
      <CustomWidget content="<div><h1>Title</h1><p>Paragraph</p></div>" />
    );
    expect(container.innerHTML).toContain('<h1>Title</h1>');
    expect(container.innerHTML).toContain('<p>Paragraph</p>');
  });
});
