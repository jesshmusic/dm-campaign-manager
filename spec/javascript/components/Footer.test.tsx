import { describe, it, expect, jest } from '@jest/globals';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Footer from '../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Footer/Footer';

// Mock NavLink component
jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/NavLink/NavLink', () => ({
  NavLink: ({ to, children, className }: any) => (
    <a href={to} className={className}>
      {children}
    </a>
  ),
}));

// Mock DndLogo component
jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/HeroBanner/DMLogo', () => {
  return function DndLogo({ className }: any) {
    return <div data-testid="dnd-logo" className={className}>Logo</div>;
  };
});

describe('Footer Component', () => {
  describe('rendering', () => {
    it('should render footer component', () => {
      const { container } = render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      expect(container.firstChild).toBeInTheDocument();
    });

    it('should render site title', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      expect(screen.getByText('Dungeon Master GURU')).toBeInTheDocument();
    });

    it('should render DndLogo component', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      expect(screen.getByTestId('dnd-logo')).toBeInTheDocument();
    });

    it('should render background image', () => {
      const { container } = render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const img = container.querySelector('img');
      expect(img).toBeInTheDocument();
    });
  });

  describe('navigation links', () => {
    it('should render Home link', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const homeLink = screen.getByText('Home');
      expect(homeLink).toBeInTheDocument();
      expect(homeLink).toHaveAttribute('href', '/');
    });

    it('should render Classes link', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const classesLink = screen.getByText('Classes');
      expect(classesLink).toBeInTheDocument();
      expect(classesLink).toHaveAttribute('href', '/app/classes');
    });

    it('should render Races link', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const racesLink = screen.getByText('Races');
      expect(racesLink).toBeInTheDocument();
      expect(racesLink).toHaveAttribute('href', '/app/races');
    });

    it('should render Monsters link', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const monstersLink = screen.getByText('Monsters');
      expect(monstersLink).toBeInTheDocument();
      expect(monstersLink).toHaveAttribute('href', '/app/monsters');
    });

    it('should render Items and Equipment link', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const itemsLink = screen.getByText('Items and Equipment');
      expect(itemsLink).toBeInTheDocument();
      expect(itemsLink).toHaveAttribute('href', '/app/items');
    });

    it('should render Spells link', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const spellsLink = screen.getByText('Spells');
      expect(spellsLink).toBeInTheDocument();
      expect(spellsLink).toHaveAttribute('href', '/app/spells');
    });

    it('should render Patreon banner link', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const patreonText = screen.getByText('Become a Patron');
      expect(patreonText).toBeInTheDocument();

      const patreonLink = patreonText.closest('a');
      expect(patreonLink).toHaveAttribute('href', expect.stringContaining('patreon.com'));
      expect(patreonLink).toHaveAttribute('target', '_blank');
      expect(patreonLink).toHaveAttribute('rel', 'noopener noreferrer');

      const patreonImage = screen.getByAltText('Become a Patron');
      expect(patreonImage).toBeInTheDocument();
    });

    it('should render all navigation links', () => {
      const { container } = render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const links = container.querySelectorAll('a');
      // 6 nav links + 1 Patreon banner link = 7 total
      expect(links.length).toBeGreaterThanOrEqual(7);
    });
  });

  describe('user prop', () => {
    it('should render without user prop', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      expect(screen.getByText('Dungeon Master GURU')).toBeInTheDocument();
    });

    it('should accept user prop', () => {
      const mockUser = {
        name: 'Test User',
        email: 'test@example.com',
      };

      render(
        <MemoryRouter>
          <Footer user={mockUser as any} />
        </MemoryRouter>
      );

      expect(screen.getByText('Dungeon Master GURU')).toBeInTheDocument();
    });
  });

  describe('layout structure', () => {
    it('should have left section with title and logo', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      expect(screen.getByText('Dungeon Master GURU')).toBeInTheDocument();
      expect(screen.getByTestId('dnd-logo')).toBeInTheDocument();
    });

    it('should have center section with Patreon banner', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const patreonImage = screen.getByAltText('Become a Patron');
      expect(patreonImage).toBeInTheDocument();
      expect(screen.getByText('Become a Patron')).toBeInTheDocument();
    });

    it('should have right section with navigation', () => {
      const { container } = render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const nav = container.querySelector('ul');
      expect(nav).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should render links with proper text content', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const links = [
        'Home',
        'Classes',
        'Races',
        'Monsters',
        'Items and Equipment',
        'Spells',
      ];

      links.forEach((linkText) => {
        expect(screen.getByText(linkText)).toBeInTheDocument();
      });
    });

    it('should have heading for site title', () => {
      render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      const heading = screen.getByRole('heading', { name: 'Dungeon Master GURU' });
      expect(heading).toBeInTheDocument();
      expect(heading.tagName).toBe('H3');
    });
  });

  describe('styling', () => {
    it('should apply styles to components', () => {
      const { container } = render(
        <MemoryRouter>
          <Footer />
        </MemoryRouter>
      );

      expect(container.firstChild).toBeInTheDocument();
    });
  });
});
