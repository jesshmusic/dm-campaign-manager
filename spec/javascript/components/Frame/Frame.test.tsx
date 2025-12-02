import React from 'react';
import { render, screen } from '../../test-utils';
import { MemoryRouter } from 'react-router-dom';
import Frame from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame';

const renderWithRouter = (component) => render(<MemoryRouter>{component}</MemoryRouter>);

describe('Frame', () => {
  it('renders with title and children', () => {
    render(
      <Frame title="Test Frame">
        <div>Child Content</div>
      </Frame>
    );
    expect(screen.getByText('Test Frame')).toBeInTheDocument();
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <Frame title="Main" subtitle="Secondary">
        <div>Content</div>
      </Frame>
    );
    expect(screen.getByText('Secondary')).toBeInTheDocument();
  });

  it('does not render subtitle when not provided', () => {
    const { container } = render(
      <Frame title="Title Only">
        <div>Content</div>
      </Frame>
    );
    const subtitle = container.querySelector('[class*="subtitle"]');
    expect(subtitle).not.toBeInTheDocument();
  });

  it('renders link when linkTo is provided', () => {
    renderWithRouter(
      <Frame title="Linked Frame" linkTo="/monsters">
        <div>Content</div>
      </Frame>
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/monsters');
  });

  it('renders title without link when linkTo is not provided', () => {
    const { container } = render(
      <Frame title="Non-Linked">
        <div>Content</div>
      </Frame>
    );
    const link = container.querySelector('a');
    expect(link).not.toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const icon = <span data-testid="test-icon">🔥</span>;
    render(
      <Frame title="With Icon" icon={icon}>
        <div>Content</div>
      </Frame>
    );
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders action button when provided', () => {
    const button = <button>Action</button>;
    render(
      <Frame title="With Action" actionButton={button}>
        <div>Content</div>
      </Frame>
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <Frame title="Custom Class" className="custom-frame-class">
        <div>Content</div>
      </Frame>
    );
    const frame = container.querySelector('.custom-frame-class');
    expect(frame).toBeInTheDocument();
  });

  it('applies custom style', () => {
    const customStyle = { backgroundColor: 'red' };
    const { container } = render(
      <Frame title="Custom Style" style={customStyle}>
        <div>Content</div>
      </Frame>
    );
    const frame = container.firstChild as HTMLElement;
    expect(frame.style.backgroundColor).toBe('red');
  });
});
