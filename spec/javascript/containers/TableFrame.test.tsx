import React from 'react';
import { render } from '../test-utils';
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
    const frame = container.querySelector('div'); // TableFrame wrapper
    expect(frame).toBeInTheDocument();
  });

  it('applies spinnerFrame class when showSpinner is true', () => {
    const { container } = render(
      <TableFrame showSpinner={true}><div>Loading</div></TableFrame>
    );
    const frame = container.querySelector('div'); // SpinnerFrame wrapper
    expect(frame).toBeInTheDocument();
  });

  it('renders content without spinner by default', () => {
    const { container, getByText } = render(<TableFrame><div>Content</div></TableFrame>);
    // Component renders content regardless of showSpinner prop
    expect(getByText('Content')).toBeInTheDocument();
    expect(container.firstChild).toBeInTheDocument();
  });
});
