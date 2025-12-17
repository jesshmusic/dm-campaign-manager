import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen } from '../test-utils';
import { MemoryRouter } from 'react-router-dom';
import DMRoutes from '../../../app/javascript/bundles/DungeonMasterCampaignManager/navigation/DMRoutes';

// Mock all page components
jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/front-page/HomePage', () => {
  return function HomePage() {
    return <div data-testid="home-page">Home Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/DndClasses', () => {
  return function DndClasses() {
    return <div data-testid="dnd-classes-page">D&D Classes Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/DndClass', () => {
  return function DndClass() {
    return <div data-testid="dnd-class-page">D&D Class Detail Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/races/Races', () => {
  return function Races() {
    return <div data-testid="races-page">Races Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/races/Race', () => {
  return function Race() {
    return <div data-testid="race-page">Race Detail Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/items/Items', () => {
  return function Items() {
    return <div data-testid="items-page">Items Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/items/Item', () => {
  return function Item() {
    return <div data-testid="item-page">Item Detail Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/Monsters', () => {
  return function Monsters() {
    return <div data-testid="monsters-page">Monsters Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/Monster', () => {
  return function Monster() {
    return <div data-testid="monster-page">Monster Detail Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/spells/Spells', () => {
  return function Spells() {
    return <div data-testid="spells-page">Spells Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/spells/Spell', () => {
  return function Spell() {
    return <div data-testid="spell-page">Spell Detail Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/Rule', () => {
  return function Rule() {
    return <div data-testid="rule-page">Rule Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/RulesCategory', () => {
  return function RulesCategory() {
    return <div data-testid="rule-page">Rules Category Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/MonsterGenerator', () => {
  return function MonsterGenerator() {
    return <div data-testid="monster-generator-page">Monster Generator Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/search-results/SearchResults', () => {
  return function SearchResults() {
    return <div data-testid="search-results-page">Search Results Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/privacy-policy/PrivacyPolicy', () => {
  return function PrivacyPolicy() {
    return <div data-testid="privacy-policy-page">Privacy Policy Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/navigation/ProtectedRoute', () => {
  return function ProtectedRoute({ as: Component, ...props }: any) {
    return <div data-testid="protected-route"><Component {...props} /></div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/AdminDashboard', () => {
  return function AdminDashboard() {
    return <div data-testid="admin-dashboard-page">Admin Dashboard</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/UserDashboard', () => {
  return function UserDashboard() {
    return <div data-testid="user-dashboard-page">User Dashboard</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/CreateWidgetPage', () => {
  return function CreateWidgetPage() {
    return <div data-testid="create-widget-page">Create Widget Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/CreateCustomActionPage', () => {
  return function CreateCustomActionPage() {
    return <div data-testid="create-custom-action-page">Create Custom Action Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/EditWidgetPage', () => {
  return function EditWidgetPage() {
    return <div data-testid="edit-widget-page">Edit Widget Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/FoundryMapsAdmin', () => {
  return function FoundryMapsAdmin() {
    return <div data-testid="foundry-maps-admin-page">Foundry Maps Admin</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/rules/RulesIndex', () => {
  return function RulesIndex() {
    return <div data-testid="rules-index-page">Rules Index Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/backgrounds/BackgroundsIndex', () => {
  return function BackgroundsIndex() {
    return <div data-testid="backgrounds-index-page">Backgrounds Index Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/backgrounds/BackgroundDetail', () => {
  return function BackgroundDetail() {
    return <div data-testid="background-detail-page">Background Detail Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/feats/FeatsIndex', () => {
  return function FeatsIndex() {
    return <div data-testid="feats-index-page">Feats Index Page</div>;
  };
});

jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/feats/FeatDetail', () => {
  return function FeatDetail() {
    return <div data-testid="feat-detail-page">Feat Detail Page</div>;
  };
});

describe('DMRoutes', () => {
  describe('public routes', () => {
    it('should render home page on root path', () => {
      render(
        <MemoryRouter initialEntries={['/']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('should render D&D classes list page', () => {
      render(
        <MemoryRouter initialEntries={['/app/classes']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('dnd-classes-page')).toBeInTheDocument();
    });

    it('should render specific D&D class page', () => {
      render(
        <MemoryRouter initialEntries={['/app/classes/fighter']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('dnd-class-page')).toBeInTheDocument();
    });

    it('should render races list page', () => {
      render(
        <MemoryRouter initialEntries={['/app/races']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('races-page')).toBeInTheDocument();
    });

    it('should render specific race page', () => {
      render(
        <MemoryRouter initialEntries={['/app/races/elf']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('race-page')).toBeInTheDocument();
    });

    it('should render specific item page', () => {
      render(
        <MemoryRouter initialEntries={['/app/items/longsword']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('item-page')).toBeInTheDocument();
    });

    it('should render monsters list page', () => {
      render(
        <MemoryRouter initialEntries={['/app/monsters/']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('monsters-page')).toBeInTheDocument();
    });

    it('should render specific monster page', () => {
      render(
        <MemoryRouter initialEntries={['/app/monsters/goblin']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('monster-page')).toBeInTheDocument();
    });

    it('should render spells list page', () => {
      render(
        <MemoryRouter initialEntries={['/app/spells/']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('spells-page')).toBeInTheDocument();
    });

    it('should render specific spell page', () => {
      render(
        <MemoryRouter initialEntries={['/app/spells/fireball']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('spell-page')).toBeInTheDocument();
    });

    it('should render rule page', () => {
      render(
        <MemoryRouter initialEntries={['/app/rules/combat']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('rule-page')).toBeInTheDocument();
    });

    it('should render monster generator page', () => {
      render(
        <MemoryRouter initialEntries={['/app/monster-generator/']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('monster-generator-page')).toBeInTheDocument();
    });

    it('should render search results page', () => {
      render(
        <MemoryRouter initialEntries={['/app/search/dragon']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('search-results-page')).toBeInTheDocument();
    });

    it('should render privacy policy page', () => {
      render(
        <MemoryRouter initialEntries={['/app/privacy-policy']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('privacy-policy-page')).toBeInTheDocument();
    });
  });

  describe('protected routes', () => {
    it('should wrap admin dashboard in ProtectedRoute', () => {
      render(
        <MemoryRouter initialEntries={['/app/admin-dashboard']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('admin-dashboard-page')).toBeInTheDocument();
    });

    it('should wrap user dashboard in ProtectedRoute', () => {
      render(
        <MemoryRouter initialEntries={['/app/user-dashboard']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('user-dashboard-page')).toBeInTheDocument();
    });

    it('should wrap create widget page in ProtectedRoute', () => {
      render(
        <MemoryRouter initialEntries={['/app/admin-dashboard/create-widget']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('create-widget-page')).toBeInTheDocument();
    });

    it('should wrap edit widget page in ProtectedRoute', () => {
      render(
        <MemoryRouter initialEntries={['/app/admin-dashboard/edit-widget/123']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('edit-widget-page')).toBeInTheDocument();
    });

    it('should wrap create custom action page in ProtectedRoute', () => {
      render(
        <MemoryRouter initialEntries={['/app/admin-dashboard/create-custom-action']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('create-custom-action-page')).toBeInTheDocument();
    });

    it('should wrap foundry maps admin in ProtectedRoute', () => {
      render(
        <MemoryRouter initialEntries={['/app/admin-dashboard/foundry-maps']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('protected-route')).toBeInTheDocument();
      expect(screen.getByTestId('foundry-maps-admin-page')).toBeInTheDocument();
    });
  });

  describe('fallback route', () => {
    it('should render home page for unknown routes', () => {
      render(
        <MemoryRouter initialEntries={['/unknown/path']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });

    it('should render home page for deeply nested unknown routes', () => {
      render(
        <MemoryRouter initialEntries={['/app/unknown/nested/path']}>
          <DMRoutes />
        </MemoryRouter>
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });

  describe('props passing', () => {
    it('should pass props to route components', () => {
      const testProps = { testProp: 'testValue' };

      render(
        <MemoryRouter initialEntries={['/']}>
          <DMRoutes {...testProps} />
        </MemoryRouter>
      );

      expect(screen.getByTestId('home-page')).toBeInTheDocument();
    });
  });
});
