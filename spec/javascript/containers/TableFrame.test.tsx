import React from 'react';
import { render } from '@testing-library/react';
import TableFrame from '../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/TableFrame';

describe('TableFrame', () => {
  it('renders children', () => {
    const { getByText } = render(
      <TableFrame>
        <div>Test Content</div>
      </TableFrame>
    );
    expect(getByText('Test Content')).toBeInTheDocument();
  });

  it('applies tableFrame class', () => {
    const { container } = render(<TableFrame><div>Content</div></TableFrame>);
    const frame = container.querySelector('.tableFrame');
    expect(frame).toBeInTheDocument();
  });

  it('applies spinnerFrame class when showSpinner is true', () => {
    const { container } = render(
      <TableFrame showSpinner={true}><div>Loading</div></TableFrame>
    );
    const frame = container.querySelector('.spinnerFrame');
    expect(frame).toBeInTheDocument();
  });

  it('does not apply spinnerFrame class by default', () => {
    const { container } = render(<TableFrame><div>Content</div></TableFrame>);
    const frame = container.querySelector('.spinnerFrame');
    expect(frame).not.toBeInTheDocument();
  });
});
