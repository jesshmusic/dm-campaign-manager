import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import AdventureHookWidget from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/AdventureHookWidget';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame', () => {
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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/CopyField/CopyField', () => {
  return function MockCopyField({ text, label }: any) {
    return (
      <div data-testid="copy-field">
        <label>{label}</label>
        <div>{text}</div>
      </div>
    );
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner({ text }: any) {
    return <div data-testid="spinner">{text}</div>;
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/AdventureHookOptions', () => {
  return function MockAdventureHookOptions({ onFormSubmit }: any) {
    return (
      <button data-testid="generate-button" onClick={() => onFormSubmit(4, 5, 'forgotten_realms')}>
        Generate
      </button>
    );
  };
});

describe('AdventureHookWidget', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AdventureHookWidget />);
  });

  it('renders with frame by default', () => {
    render(<AdventureHookWidget />);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getAllByText('Random Adventure Hook').length).toBeGreaterThan(0);
  });

  it('renders without frame when hideFrame is true', () => {
    render(<AdventureHookWidget hideFrame={true} />);
    expect(screen.queryByTestId('frame')).not.toBeInTheDocument();
  });

  it('shows spinner when loading', async () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {}));

    render(<AdventureHookWidget />);

    const generateButton = screen.getByTestId('generate-button');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  it('displays adventure hook after generation', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { adventure_hook: 'A dragon threatens the village!' },
    });

    render(<AdventureHookWidget />);

    const generateButton = screen.getByTestId('generate-button');
    fireEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('A dragon threatens the village!')).toBeInTheDocument();
    });
  });
});
