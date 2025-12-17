import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import '@testing-library/jest-dom';
import EditionToggle from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/EditionToggle/EditionToggle';
import { EditionProvider } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/EditionContext';

// Mock window.location.reload
const mockReload = jest.fn();
Object.defineProperty(window, 'location', {
  value: { reload: mockReload },
  writable: true,
});

describe('EditionToggle', () => {
  beforeEach(() => {
    mockReload.mockClear();
    localStorage.clear();
  });

  describe('expanded view (default)', () => {
    it('renders the toggle with "Rules:" label', () => {
      render(
        <EditionProvider>
          <EditionToggle />
        </EditionProvider>
      );

      expect(screen.getByText('Rules:')).toBeInTheDocument();
    });

    it('renders both 2024 and 2014 buttons', () => {
      render(
        <EditionProvider>
          <EditionToggle />
        </EditionProvider>
      );

      expect(screen.getByText('2024')).toBeInTheDocument();
      expect(screen.getByText('2014')).toBeInTheDocument();
    });

    it('shows 2024 as active when edition is 2024', () => {
      render(
        <EditionProvider initialEdition="2024">
          <EditionToggle />
        </EditionProvider>
      );

      const button2024 = screen.getByText('2024');
      const button2014 = screen.getByText('2014');

      expect(button2024).toHaveAttribute('title', 'Use 2024 D&D Rules');
      expect(button2014).toHaveAttribute('title', 'Use 2014 D&D Rules');
    });

    it('shows 2014 as active when edition is 2014', () => {
      render(
        <EditionProvider initialEdition="2014">
          <EditionToggle />
        </EditionProvider>
      );

      expect(screen.getByText('2024')).toBeInTheDocument();
      expect(screen.getByText('2014')).toBeInTheDocument();
    });

    it('calls setEdition and reloads when clicking different edition', () => {
      render(
        <EditionProvider initialEdition="2024">
          <EditionToggle />
        </EditionProvider>
      );

      const button2014 = screen.getByText('2014');
      fireEvent.click(button2014);

      expect(mockReload).toHaveBeenCalled();
      expect(localStorage.getItem('dnd-edition')).toBe('2014');
    });

    it('does not reload when clicking the same edition', () => {
      render(
        <EditionProvider initialEdition="2024">
          <EditionToggle />
        </EditionProvider>
      );

      const button2024 = screen.getByText('2024');
      fireEvent.click(button2024);

      expect(mockReload).not.toHaveBeenCalled();
    });
  });

  describe('collapsed view', () => {
    it('renders abbreviated buttons when collapsed', () => {
      render(
        <EditionProvider>
          <EditionToggle isCollapsed={true} />
        </EditionProvider>
      );

      expect(screen.getByText("'24")).toBeInTheDocument();
      expect(screen.getByText("'14")).toBeInTheDocument();
    });

    it('does not show "Rules:" label when collapsed', () => {
      render(
        <EditionProvider>
          <EditionToggle isCollapsed={true} />
        </EditionProvider>
      );

      expect(screen.queryByText('Rules:')).not.toBeInTheDocument();
    });

    it('has correct titles on collapsed buttons', () => {
      render(
        <EditionProvider>
          <EditionToggle isCollapsed={true} />
        </EditionProvider>
      );

      expect(screen.getByTitle('2024 Rules')).toBeInTheDocument();
      expect(screen.getByTitle('2014 Rules')).toBeInTheDocument();
    });

    it('calls setEdition and reloads when clicking different edition in collapsed mode', () => {
      render(
        <EditionProvider initialEdition="2024">
          <EditionToggle isCollapsed={true} />
        </EditionProvider>
      );

      const button2014 = screen.getByText("'14");
      fireEvent.click(button2014);

      expect(mockReload).toHaveBeenCalled();
      expect(localStorage.getItem('dnd-edition')).toBe('2014');
    });

    it('does not reload when clicking the same edition in collapsed mode', () => {
      render(
        <EditionProvider initialEdition="2024">
          <EditionToggle isCollapsed={true} />
        </EditionProvider>
      );

      const button2024 = screen.getByText("'24");
      fireEvent.click(button2024);

      expect(mockReload).not.toHaveBeenCalled();
    });
  });

  describe('isCollapsed prop', () => {
    it('defaults to expanded when isCollapsed is not provided', () => {
      render(
        <EditionProvider>
          <EditionToggle />
        </EditionProvider>
      );

      expect(screen.getByText('Rules:')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('shows expanded view when isCollapsed is false', () => {
      render(
        <EditionProvider>
          <EditionToggle isCollapsed={false} />
        </EditionProvider>
      );

      expect(screen.getByText('Rules:')).toBeInTheDocument();
      expect(screen.getByText('2024')).toBeInTheDocument();
    });
  });
});
