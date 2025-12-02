import React from 'react';
import { render, screen } from '../../../test-utils';
import GenerateCommoner from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/GenerateCommoner';

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame', () => {
  return function MockFrame({ title, subtitle, children }: any) {
    return (
      <div data-testid="frame">
        <h2>{title}</h2>
        <p>{subtitle}</p>
        {children}
      </div>
    );
  };
});

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/NameOptions', () => {
  return function MockNameOptions({ onFormSubmit, title, token }: any) {
    return (
      <div data-testid="name-options">
        <span>Title: {title}</span>
        <button onClick={onFormSubmit}>Submit</button>
        {token && <span>Token: {token}</span>}
      </div>
    );
  };
});

describe('GenerateCommoner', () => {
  it('renders without crashing', () => {
    render(<GenerateCommoner onFormSubmit={jest.fn()} />);
  });

  it('displays frame with correct title', () => {
    render(<GenerateCommoner onFormSubmit={jest.fn()} />);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getByText('Generate Commoner')).toBeInTheDocument();
  });

  it('displays frame with correct subtitle', () => {
    render(<GenerateCommoner onFormSubmit={jest.fn()} />);
    expect(screen.getByText('Quickly generate a random commoner')).toBeInTheDocument();
  });

  it('renders NameOptions component', () => {
    render(<GenerateCommoner onFormSubmit={jest.fn()} />);
    expect(screen.getByTestId('name-options')).toBeInTheDocument();
  });

  it('passes correct title to NameOptions', () => {
    render(<GenerateCommoner onFormSubmit={jest.fn()} />);
    expect(screen.getByText('Title: Commoner')).toBeInTheDocument();
  });

  it('passes onFormSubmit to NameOptions', () => {
    const mockSubmit = jest.fn();
    render(<GenerateCommoner onFormSubmit={mockSubmit} />);

    const button = screen.getByText('Submit');
    button.click();

    expect(mockSubmit).toHaveBeenCalled();
  });

  it('passes token to NameOptions when provided', () => {
    render(<GenerateCommoner onFormSubmit={jest.fn()} token="test-token" />);
    expect(screen.getByText('Token: test-token')).toBeInTheDocument();
  });

  it('works without token', () => {
    render(<GenerateCommoner onFormSubmit={jest.fn()} />);
    expect(screen.queryByText(/Token:/)).not.toBeInTheDocument();
  });
});
