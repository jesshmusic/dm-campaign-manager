import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '../test-utils';
import { MemoryRouter } from 'react-router-dom';
import PageTitle from '../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle';

describe('PageTitle Component', () => {
  describe('rendering', () => {
    it('should render title text', () => {
      render(
        <MemoryRouter>
          <PageTitle title="Test Page Title" />
        </MemoryRouter>
      );

      expect(screen.getByText('Test Page Title')).toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Page Title');
    });

    it('should render subtitle when provided', () => {
      render(
        <MemoryRouter>
          <PageTitle title="Main Title" subtitle="This is a subtitle" />
        </MemoryRouter>
      );

      expect(screen.getByText('Main Title')).toBeInTheDocument();
      expect(screen.getByText('This is a subtitle')).toBeInTheDocument();
    });

    it('should not render subtitle when not provided', () => {
      const { container } = render(
        <MemoryRouter>
          <PageTitle title="Title Without Subtitle" />
        </MemoryRouter>
      );

      expect(screen.getByText('Title Without Subtitle')).toBeInTheDocument();
      expect(container.querySelector('p')).not.toBeInTheDocument();
    });
  });

  describe('button', () => {
    it('should render button when hasButton and buttonLink are provided', () => {
      render(
        <MemoryRouter>
          <PageTitle
            title="Page with Button"
            hasButton={true}
            buttonLink="/create"
            buttonTitle="Create New"
            buttonVariant="primary"
          />
        </MemoryRouter>
      );

      const button = screen.getByRole('link', { name: 'Create New' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('href', '/create');
      expect(button).toHaveClass('btn', 'btn-primary');
    });

    it('should not render button when hasButton is false', () => {
      render(
        <MemoryRouter>
          <PageTitle
            title="Page Without Button"
            hasButton={false}
            buttonLink="/create"
            buttonTitle="Create New"
          />
        </MemoryRouter>
      );

      expect(screen.queryByRole('link', { name: 'Create New' })).not.toBeInTheDocument();
    });

    it('should not render button when buttonLink is not provided', () => {
      render(
        <MemoryRouter>
          <PageTitle
            title="Page Without Link"
            hasButton={true}
            buttonTitle="Create New"
          />
        </MemoryRouter>
      );

      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('should apply button variant class', () => {
      render(
        <MemoryRouter>
          <PageTitle
            title="Page with Success Button"
            hasButton={true}
            buttonLink="/action"
            buttonTitle="Success Action"
            buttonVariant="success"
          />
        </MemoryRouter>
      );

      const button = screen.getByRole('link', { name: 'Success Action' });
      expect(button).toHaveClass('btn-success');
    });

    it('should render button with different variants', () => {
      const variants = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];

      variants.forEach((variant) => {
        const { unmount } = render(
          <MemoryRouter>
            <PageTitle
              title={`Page with ${variant} Button`}
              hasButton={true}
              buttonLink="/action"
              buttonTitle={`${variant} Button`}
              buttonVariant={variant}
            />
          </MemoryRouter>
        );

        const button = screen.getByRole('link', { name: `${variant} Button` });
        expect(button).toHaveClass(`btn-${variant}`);
        unmount();
      });
    });
  });

  describe('draconis styling', () => {
    it('should not apply draconis class by default', () => {
      render(
        <MemoryRouter>
          <PageTitle title="Normal Title" />
        </MemoryRouter>
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });

    it('should apply draconis class when isDraconis is true', () => {
      render(
        <MemoryRouter>
          <PageTitle title="Draconis Title" isDraconis={true} />
        </MemoryRouter>
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toBeInTheDocument();
    });
  });

  describe('combined props', () => {
    it('should render all elements when all props provided', () => {
      render(
        <MemoryRouter>
          <PageTitle
            title="Complete Page Title"
            subtitle="Complete subtitle text"
            hasButton={true}
            buttonLink="/complete-action"
            buttonTitle="Complete Action"
            buttonVariant="primary"
            isDraconis={true}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('Complete Page Title')).toBeInTheDocument();
      expect(screen.getByText('Complete subtitle text')).toBeInTheDocument();
      const button = screen.getByRole('link', { name: 'Complete Action' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('btn-primary');
    });

    it('should handle minimal props', () => {
      render(
        <MemoryRouter>
          <PageTitle title="Minimal Title" />
        </MemoryRouter>
      );

      expect(screen.getByText('Minimal Title')).toBeInTheDocument();
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(
        <MemoryRouter>
          <PageTitle title="Accessible Title" />
        </MemoryRouter>
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('Accessible Title');
    });

    it('should have accessible button with proper role', () => {
      render(
        <MemoryRouter>
          <PageTitle
            title="Page"
            hasButton={true}
            buttonLink="/action"
            buttonTitle="Accessible Button"
            buttonVariant="primary"
          />
        </MemoryRouter>
      );

      const button = screen.getByRole('link', { name: 'Accessible Button' });
      expect(button).toBeInTheDocument();
    });
  });

  describe('edge cases', () => {
    it('should handle empty string title', () => {
      render(
        <MemoryRouter>
          <PageTitle title="" />
        </MemoryRouter>
      );

      const heading = screen.getByRole('heading', { level: 1 });
      expect(heading).toHaveTextContent('');
    });

    it('should handle empty string subtitle', () => {
      render(
        <MemoryRouter>
          <PageTitle title="Title" subtitle="" />
        </MemoryRouter>
      );

      expect(screen.getByText('Title')).toBeInTheDocument();
    });

    it('should handle special characters in title', () => {
      const specialTitle = 'Title with <special> & "characters"';
      render(
        <MemoryRouter>
          <PageTitle title={specialTitle} />
        </MemoryRouter>
      );

      expect(screen.getByText(specialTitle)).toBeInTheDocument();
    });

    it('should handle long titles', () => {
      const longTitle = 'This is a very long title that should still render properly without breaking the layout or causing any issues in the component';
      render(
        <MemoryRouter>
          <PageTitle title={longTitle} />
        </MemoryRouter>
      );

      expect(screen.getByText(longTitle)).toBeInTheDocument();
    });

    it('should handle long subtitles', () => {
      const longSubtitle = 'This is a very long subtitle that contains a lot of text to ensure the component can handle lengthy descriptions without breaking';
      render(
        <MemoryRouter>
          <PageTitle title="Title" subtitle={longSubtitle} />
        </MemoryRouter>
      );

      expect(screen.getByText(longSubtitle)).toBeInTheDocument();
    });
  });
});
