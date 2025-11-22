import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchField from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Search/SearchField';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('react-icons/all', () => ({
  GiArchiveResearch: () => <svg data-testid="search-icon" />,
}));

const renderWithRouter = (component) => render(<MemoryRouter>{component}</MemoryRouter>);

describe('SearchField', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders without crashing', () => {
    renderWithRouter(<SearchField />);
  });

  it('renders search input field', () => {
    renderWithRouter(<SearchField />);
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toBeInTheDocument();
  });

  it('renders search button', () => {
    renderWithRouter(<SearchField />);
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });

  it('accepts user input', () => {
    renderWithRouter(<SearchField />);
    const input = screen.getByPlaceholderText('Search...') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'fireball' } });
    expect(input.value).toBe('fireball');
  });

  it('submits form and navigates on search', async () => {
    renderWithRouter(<SearchField />);
    const input = screen.getByPlaceholderText('Search...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'dragon' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/app/search/dragon');
    });
  });

  it('logs data on submit', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    renderWithRouter(<SearchField />);

    const input = screen.getByPlaceholderText('Search...');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'test' } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('has search icon', () => {
    const { container } = renderWithRouter(<SearchField />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('has correct form structure', () => {
    const { container } = renderWithRouter(<SearchField />);
    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();
  });
});
