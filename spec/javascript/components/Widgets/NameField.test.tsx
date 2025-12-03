import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import NameField from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/NameField';
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
        <div data-testid="copy-field-value">{text}</div>
      </div>
    );
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/NameOptions', () => {
  return function MockNameOptions({ onFormSubmit }: any) {
    return (
      <button data-testid="name-options-button" onClick={() => onFormSubmit('female', 'human')}>
        Generate
      </button>
    );
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DndSpinners/DndSpinner', () => {
  return function MockDndSpinner({ text }: any) {
    return <div data-testid="spinner">{text}</div>;
  };
});

describe('NameField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NameField />);
  });

  it('renders with frame by default', () => {
    render(<NameField />);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getByText('Random Character Name')).toBeInTheDocument();
  });

  it('renders without frame when hideFrame is true', () => {
    render(<NameField hideFrame={true} />);
    expect(screen.queryByTestId('frame')).not.toBeInTheDocument();
  });

  it('displays copy field initially', () => {
    render(<NameField />);
    expect(screen.getByTestId('copy-field')).toBeInTheDocument();
  });

  it('displays name options', () => {
    render(<NameField />);
    expect(screen.getByTestId('name-options-button')).toBeInTheDocument();
  });

  it('shows spinner while loading', async () => {
    mockedAxios.get.mockImplementation(() => new Promise(() => {})); // Never resolves

    render(<NameField />);

    const button = screen.getByTestId('name-options-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
      expect(screen.getByText('Generating Random Name...')).toBeInTheDocument();
    });
  });

  it('generates name when form is submitted', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { name: 'Aragorn' },
    });

    render(<NameField />);

    const button = screen.getByTestId('name-options-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/v1/random_fantasy_name.json?random_monster_gender=female&random_monster_race=human'
      );
    });

    await waitFor(() => {
      expect(screen.getByTestId('copy-field-value')).toHaveTextContent('Aragorn');
    });
  });

  it('calls API with correct parameters', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { name: 'Gandalf' },
    });

    render(<NameField />);

    const button = screen.getByTestId('name-options-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/v1/random_fantasy_name.json?random_monster_gender=female&random_monster_race=human'
      );
    });
  });

  it('shows loading spinner during API call', async () => {
    let resolvePromise: any;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockedAxios.get.mockReturnValue(promise as any);

    render(<NameField />);

    const button = screen.getByTestId('name-options-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });

    // Resolve the promise to clean up
    resolvePromise({ data: { name: 'Test' } });
  });
});
