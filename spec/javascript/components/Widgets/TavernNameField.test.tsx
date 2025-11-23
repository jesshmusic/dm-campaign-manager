import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TavernNameField from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/TavernNameField';
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

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick }: any) {
    return (
      <button data-testid="generate-button" onClick={onClick}>
        {title}
      </button>
    );
  };
});

jest.mock('react-icons/all', () => ({
  GiBeerStein: () => <span>Beer</span>,
}));

describe('TavernNameField', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<TavernNameField />);
  });

  it('renders with frame by default', () => {
    render(<TavernNameField />);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getByText('Random Tavern Name')).toBeInTheDocument();
  });

  it('renders without frame when hideFrame is true', () => {
    render(<TavernNameField hideFrame={true} />);
    expect(screen.queryByTestId('frame')).not.toBeInTheDocument();
  });

  it('displays copy field', () => {
    render(<TavernNameField />);
    expect(screen.getByTestId('copy-field')).toBeInTheDocument();
  });

  it('displays generate button', () => {
    render(<TavernNameField />);
    expect(screen.getByTestId('generate-button')).toBeInTheDocument();
    expect(screen.getByText('Get Tavern Name')).toBeInTheDocument();
  });

  it('generates tavern name when button is clicked', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { name: 'The Prancing Pony' },
    });

    render(<TavernNameField />);

    const button = screen.getByTestId('generate-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/random_tavern_name.json');
    });

    await waitFor(() => {
      expect(screen.getByTestId('copy-field-value')).toHaveTextContent('The Prancing Pony');
    });
  });

  it('displays generated name', async () => {
    mockedAxios.get.mockResolvedValue({
      data: { name: 'The Golden Dragon' },
    });

    render(<TavernNameField />);

    const button = screen.getByTestId('generate-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/random_tavern_name.json');
    });

    await waitFor(() => {
      expect(screen.getByTestId('copy-field-value')).toHaveTextContent('The Golden Dragon');
    });
  });
});
