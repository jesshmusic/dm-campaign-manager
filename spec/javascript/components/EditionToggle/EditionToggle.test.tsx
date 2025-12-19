import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import EditionToggle from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/EditionToggle/EditionToggle';
import { EditionProvider } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/EditionContext';

// Helper to render with Router and EditionProvider
const renderWithProviders = (edition: '2014' | '2024' = '2024', isCollapsed = false) => {
  return render(
    <MemoryRouter>
      <EditionProvider initialEdition={edition}>
        <EditionToggle isCollapsed={isCollapsed} />
      </EditionProvider>
    </MemoryRouter>
  );
};

describe('EditionToggle', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('expanded view (default)', () => {
    it('renders the toggle with "Rules:" label', () => {
      renderWithProviders();

      expect(screen.getByText('Rules:')).toBeInTheDocument();
    });

    it('renders both 2024 and 2014 buttons', () => {
      renderWithProviders();

      expect(screen.getByText('2024')).toBeInTheDocument();
      expect(screen.getByText('2014')).toBeInTheDocument();
    });

    it('shows 2024 as active when edition is 2024', () => {
      renderWithProviders('2024');

      const button2024 = screen.getByText('2024');
      const button2014 = screen.getByText('2014');

      expect(button2024).toHaveAttribute('title', 'Use 2024 D&D Rules');
      expect(button2014).toHaveAttribute('title', 'Use 2014 D&D Rules');
    });

    it('shows 2014 as active when edition is 2014', () => {
      renderWithProviders('2014');

      expect(screen.getByText('2024')).toBeInTheDocument();
      expect(screen.getByText('2014')).toBeInTheDocument();
    });

    it('updates localStorage when clicking different edition', () => {
      renderWithProviders('2024');

      const button2014 = screen.getByText('2014');
      fireEvent.click(button2014);

      expect(localStorage.getItem('dnd-edition')).toBe('2014');
    });

    it('does not change localStorage when clicking the same edition', () => {
      localStorage.setItem('dnd-edition', '2024');
      renderWithProviders('2024');

      const button2024 = screen.getByText('2024');
      fireEvent.click(button2024);

      expect(localStorage.getItem('dnd-edition')).toBe('2024');
    });
  });

  describe('collapsed view', () => {
    it('renders abbreviated buttons when collapsed', () => {
      renderWithProviders('2024', true);

      expect(screen.getByText("'24")).toBeInTheDocument();
      expect(screen.getByText("'14")).toBeInTheDocument();
    });

    it('does not show "Rules:" label when collapsed', () => {
      renderWithProviders('2024', true);

      expect(screen.queryByText('Rules:')).not.toBeInTheDocument();
    });

    it('has correct titles on collapsed buttons', () => {
      renderWithProviders('2024', true);

      expect(screen.getByTitle('2024 Rules')).toBeInTheDocument();
      expect(screen.getByTitle('2014 Rules')).toBeInTheDocument();
    });

    it('updates localStorage when clicking different edition in collapsed mode', () => {
      renderWithProviders('2024', true);

      const button2014 = screen.getByText("'14");
      fireEvent.click(button2014);

      expect(localStorage.getItem('dnd-edition')).toBe('2014');
    });

    it('does not change localStorage when clicking the same edition in collapsed mode', () => {
      localStorage.setItem('dnd-edition', '2024');
      renderWithProviders('2024', true);

      const button2024 = screen.getByText("'24");
      fireEvent.click(button2024);

      expect(localStorage.getItem('dnd-edition')).toBe('2024');
    });
  });

  describe('isCollapsed prop', () => {
    it('defaults to expanded when isCollapsed is not provided', () => {
      renderWithProviders();

      expect(screen.getByText('Rules:')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('shows expanded view when isCollapsed is false', () => {
      renderWithProviders('2024', false);

      expect(screen.getByText('Rules:')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });
  });
});
