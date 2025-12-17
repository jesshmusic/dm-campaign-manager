import React from 'react';
import { render, screen, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  EditionProvider,
  useEdition,
} from '../../../app/javascript/bundles/DungeonMasterCampaignManager/contexts/EditionContext';

// Test component that uses the hook
const TestConsumer = () => {
  const { edition, setEdition, isEdition2024, isEdition2014 } = useEdition();
  return (
    <div>
      <span data-testid="edition">{edition}</span>
      <span data-testid="is2024">{isEdition2024.toString()}</span>
      <span data-testid="is2014">{isEdition2014.toString()}</span>
      <button onClick={() => setEdition('2014')}>Set 2014</button>
      <button onClick={() => setEdition('2024')}>Set 2024</button>
    </div>
  );
};

describe('EditionContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('EditionProvider', () => {
    it('provides default edition of 2024', () => {
      render(
        <EditionProvider>
          <TestConsumer />
        </EditionProvider>
      );

      expect(screen.getByTestId('edition')).toHaveTextContent('2024');
      expect(screen.getByTestId('is2024')).toHaveTextContent('true');
      expect(screen.getByTestId('is2014')).toHaveTextContent('false');
    });

    it('uses initialEdition prop when provided', () => {
      render(
        <EditionProvider initialEdition="2014">
          <TestConsumer />
        </EditionProvider>
      );

      expect(screen.getByTestId('edition')).toHaveTextContent('2014');
      expect(screen.getByTestId('is2024')).toHaveTextContent('false');
      expect(screen.getByTestId('is2014')).toHaveTextContent('true');
    });

    it('reads from localStorage when no initialEdition is provided', () => {
      localStorage.setItem('dnd-edition', '2014');

      render(
        <EditionProvider>
          <TestConsumer />
        </EditionProvider>
      );

      expect(screen.getByTestId('edition')).toHaveTextContent('2014');
    });

    it('prioritizes initialEdition over localStorage', () => {
      localStorage.setItem('dnd-edition', '2014');

      render(
        <EditionProvider initialEdition="2024">
          <TestConsumer />
        </EditionProvider>
      );

      expect(screen.getByTestId('edition')).toHaveTextContent('2024');
    });

    it('ignores invalid localStorage values', () => {
      localStorage.setItem('dnd-edition', 'invalid');

      render(
        <EditionProvider>
          <TestConsumer />
        </EditionProvider>
      );

      expect(screen.getByTestId('edition')).toHaveTextContent('2024');
    });

    it('updates edition when setEdition is called', () => {
      render(
        <EditionProvider>
          <TestConsumer />
        </EditionProvider>
      );

      expect(screen.getByTestId('edition')).toHaveTextContent('2024');

      act(() => {
        screen.getByText('Set 2014').click();
      });

      expect(screen.getByTestId('edition')).toHaveTextContent('2014');
      expect(screen.getByTestId('is2024')).toHaveTextContent('false');
      expect(screen.getByTestId('is2014')).toHaveTextContent('true');
    });

    it('persists edition to localStorage when changed', () => {
      render(
        <EditionProvider>
          <TestConsumer />
        </EditionProvider>
      );

      act(() => {
        screen.getByText('Set 2014').click();
      });

      expect(localStorage.getItem('dnd-edition')).toBe('2014');
    });

    it('syncs initial edition to localStorage on mount', () => {
      render(
        <EditionProvider initialEdition="2014">
          <TestConsumer />
        </EditionProvider>
      );

      expect(localStorage.getItem('dnd-edition')).toBe('2014');
    });

    it('renders children correctly', () => {
      render(
        <EditionProvider>
          <div data-testid="child">Child Content</div>
        </EditionProvider>
      );

      expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
    });
  });

  describe('useEdition hook', () => {
    it('returns the correct context values', () => {
      render(
        <EditionProvider initialEdition="2024">
          <TestConsumer />
        </EditionProvider>
      );

      expect(screen.getByTestId('edition')).toHaveTextContent('2024');
      expect(screen.getByTestId('is2024')).toHaveTextContent('true');
      expect(screen.getByTestId('is2014')).toHaveTextContent('false');
    });

    it('toggles between editions correctly', () => {
      render(
        <EditionProvider>
          <TestConsumer />
        </EditionProvider>
      );

      // Start with 2024
      expect(screen.getByTestId('edition')).toHaveTextContent('2024');

      // Switch to 2014
      act(() => {
        screen.getByText('Set 2014').click();
      });
      expect(screen.getByTestId('edition')).toHaveTextContent('2014');

      // Switch back to 2024
      act(() => {
        screen.getByText('Set 2024').click();
      });
      expect(screen.getByTestId('edition')).toHaveTextContent('2024');
    });
  });
});
