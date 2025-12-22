import { Route, Routes, useParams, Navigate } from 'react-router-dom';
import HomePage from '../pages/front-page/HomePage';
import DndClasses from '../pages/dnd-classes/DndClasses';
import Races from '../pages/races/Races';
import Race from '../pages/races/Race';
import Items from '../pages/items/Items';
import Item from '../pages/items/Item';
import Monsters from '../pages/monsters/Monsters';
import Monster from '../pages/monsters/Monster';
import Spells from '../pages/spells/Spells';
import Spell from '../pages/spells/Spell';
import RulesIndex from '../pages/rules/RulesIndex';
import RulesCategory from '../pages/rules/RulesCategory';
import RulesGlossary from '../pages/rules/RulesGlossary';
import BackgroundsIndex from '../pages/backgrounds/BackgroundsIndex';
import BackgroundDetail from '../pages/backgrounds/BackgroundDetail';
import FeatsIndex from '../pages/feats/FeatsIndex';
import FeatDetail from '../pages/feats/FeatDetail';
import MonsterGenerator from '../pages/monster-generator/MonsterGenerator';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from '../pages/admin-dashboard/AdminDashboard';
import UserDashboard from '../pages/user-dashboard/UserDashboard';
import DndClass from '../pages/dnd-classes/DndClass';
import CreateWidgetPage from '../pages/admin-dashboard/CreateWidgetPage';
import CreateCustomActionPage from '../pages/admin-dashboard/CreateCustomActionPage';
import EditWidgetPage from '../pages/admin-dashboard/EditWidgetPage';
import SearchResults from '../pages/search-results/SearchResults';
import PrivacyPolicy from '../pages/privacy-policy/PrivacyPolicy';
import FoundryMapsAdmin from '../pages/FoundryMapsAdmin';
import { DEFAULT_EDITION, isValidEdition } from '../utilities/editionUrls';
import { ItemType } from '../pages/items/use-data';

type ResolverProps = Record<string, unknown>;

// Map of item category slugs to ItemType values
const itemCategoryMap: Record<string, ItemType> = {
  armor: ItemType.armor,
  gear: ItemType.gear,
  'magic-items': ItemType.magic,
  'magic-armor': ItemType.magicArmor,
  'magic-weapons': ItemType.magicWeapon,
  tools: ItemType.tool,
  vehicles: ItemType.vehicle,
  weapons: ItemType.weapon,
};

const itemCategoryTitles: Record<string, string> = {
  armor: 'Armor',
  gear: 'Adventuring Gear',
  'magic-items': 'Magic Items',
  'magic-armor': 'Magic Armor',
  'magic-weapons': 'Magic Weapons',
  tools: 'Tools',
  vehicles: 'Vehicles and Mounts',
  weapons: 'Weapons',
};

// Resolver for /app/:edition/items/:category/:slug - item detail
const ItemDetailResolver = (props: ResolverProps) => {
  const { category } = useParams<{ category: string }>();

  // If category is known, render item detail
  if (category && itemCategoryMap[category]) {
    return <Item {...props} />;
  }

  // Unknown category, still try to render item
  return <Item {...props} />;
};

// Resolver for /app/:edition/items/:category - could be category list or item detail
const ItemCategoryResolver = (props: ResolverProps) => {
  const { category } = useParams<{ category: string }>();

  // If category is a known category, render category list
  if (category && itemCategoryMap[category]) {
    return (
      <Items
        {...props}
        itemType={itemCategoryMap[category]}
        pageTitle={itemCategoryTitles[category]}
      />
    );
  }

  // Otherwise treat as item slug (for backwards compatibility)
  return <Item {...props} />;
};

// Generic legacy redirect for old URL patterns: /app/:type/:edition/:slug → /app/:edition/:type/:slug
const LegacyContentRedirect = ({ contentType }: { contentType: string }) => {
  const { param, slug } = useParams<{ param?: string; slug?: string }>();

  // If param is an edition, redirect to new structure
  if (isValidEdition(param)) {
    if (slug) {
      return <Navigate to={`/app/${param}/${contentType}/${slug}`} replace />;
    }
    return <Navigate to={`/app/${param}/${contentType}`} replace />;
  }

  // If param is not an edition, assume it's a slug and use default edition
  return <Navigate to={`/app/${DEFAULT_EDITION}/${contentType}/${param}`} replace />;
};

const DMRoutes = (props: ResolverProps) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage {...props} />} />

      {/* Edition-aware routes: /app/:edition/... */}

      {/* Classes */}
      <Route path="/app/:edition/classes/:classSlug" element={<DndClass {...props} />} />
      <Route path="/app/:edition/classes" element={<DndClasses {...props} />} />

      {/* Races */}
      <Route path="/app/:edition/races/:raceSlug" element={<Race {...props} />} />
      <Route path="/app/:edition/races" element={<Races {...props} />} />

      {/* Items with category support */}
      <Route
        path="/app/:edition/items/:category/:itemSlug"
        element={<ItemDetailResolver {...props} />}
      />
      <Route path="/app/:edition/items/:category" element={<ItemCategoryResolver {...props} />} />
      <Route
        path="/app/:edition/items"
        element={<Items {...props} itemType={ItemType.all} pageTitle="All Equipment and Items" />}
      />

      {/* Monsters */}
      <Route path="/app/:edition/monsters/:monsterSlug" element={<Monster {...props} />} />
      <Route path="/app/:edition/monsters" element={<Monsters {...props} />} />

      {/* Spells */}
      <Route path="/app/:edition/spells/:spellSlug" element={<Spell {...props} />} />
      <Route path="/app/:edition/spells" element={<Spells {...props} />} />

      {/* Rules */}
      <Route path="/app/:edition/rules/rules-glossary" element={<RulesGlossary {...props} />} />
      <Route path="/app/:edition/rules/:ruleSlug" element={<RulesCategory {...props} />} />
      <Route path="/app/:edition/rules" element={<RulesIndex {...props} />} />

      {/* Backgrounds */}
      <Route
        path="/app/:edition/backgrounds/:backgroundSlug"
        element={<BackgroundDetail {...props} />}
      />
      <Route path="/app/:edition/backgrounds" element={<BackgroundsIndex {...props} />} />

      {/* Feats */}
      <Route path="/app/:edition/feats/:featSlug" element={<FeatDetail {...props} />} />
      <Route path="/app/:edition/feats" element={<FeatsIndex {...props} />} />

      {/* Legacy redirects for old URL structure: /app/:type/:edition/:slug → /app/:edition/:type/:slug */}
      <Route
        path="/app/classes/:param/:slug"
        element={<LegacyContentRedirect contentType="classes" />}
      />
      <Route path="/app/classes/:param" element={<LegacyContentRedirect contentType="classes" />} />
      <Route
        path="/app/classes"
        element={<Navigate to={`/app/${DEFAULT_EDITION}/classes`} replace />}
      />

      <Route path="/app/races/:param/:slug" element={<LegacyContentRedirect contentType="races" />} />
      <Route path="/app/races/:param" element={<LegacyContentRedirect contentType="races" />} />
      <Route
        path="/app/races"
        element={<Navigate to={`/app/${DEFAULT_EDITION}/races`} replace />}
      />

      <Route path="/app/items/:param/:slug" element={<LegacyContentRedirect contentType="items" />} />
      <Route path="/app/items/:param" element={<LegacyContentRedirect contentType="items" />} />
      <Route
        path="/app/items"
        element={<Navigate to={`/app/${DEFAULT_EDITION}/items`} replace />}
      />

      <Route
        path="/app/monsters/:param/:slug"
        element={<LegacyContentRedirect contentType="monsters" />}
      />
      <Route
        path="/app/monsters/:param"
        element={<LegacyContentRedirect contentType="monsters" />}
      />
      <Route
        path="/app/monsters"
        element={<Navigate to={`/app/${DEFAULT_EDITION}/monsters`} replace />}
      />

      <Route
        path="/app/spells/:param/:slug"
        element={<LegacyContentRedirect contentType="spells" />}
      />
      <Route path="/app/spells/:param" element={<LegacyContentRedirect contentType="spells" />} />
      <Route
        path="/app/spells"
        element={<Navigate to={`/app/${DEFAULT_EDITION}/spells`} replace />}
      />

      <Route path="/app/rules/:param/:slug" element={<LegacyContentRedirect contentType="rules" />} />
      <Route path="/app/rules/:param" element={<LegacyContentRedirect contentType="rules" />} />
      <Route
        path="/app/rules"
        element={<Navigate to={`/app/${DEFAULT_EDITION}/rules`} replace />}
      />

      <Route
        path="/app/backgrounds/:param/:slug"
        element={<LegacyContentRedirect contentType="backgrounds" />}
      />
      <Route
        path="/app/backgrounds/:param"
        element={<LegacyContentRedirect contentType="backgrounds" />}
      />
      <Route
        path="/app/backgrounds"
        element={<Navigate to={`/app/${DEFAULT_EDITION}/backgrounds`} replace />}
      />

      <Route path="/app/feats/:param/:slug" element={<LegacyContentRedirect contentType="feats" />} />
      <Route path="/app/feats/:param" element={<LegacyContentRedirect contentType="feats" />} />
      <Route
        path="/app/feats"
        element={<Navigate to={`/app/${DEFAULT_EDITION}/feats`} replace />}
      />

      {/* Non-edition routes */}
      <Route path="/app/monster-generator/" element={<MonsterGenerator {...props} />} />
      <Route path="/app/search/:query" element={<SearchResults {...props} />} />
      <Route path="/app/privacy-policy" element={<PrivacyPolicy {...props} />} />
      <Route
        path="/app/admin-dashboard"
        element={<ProtectedRoute as={AdminDashboard} requireAdmin={true} {...props} />}
      />
      <Route
        path="/app/admin-dashboard/create-custom-action"
        element={<ProtectedRoute as={CreateCustomActionPage} requireAdmin={true} {...props} />}
      />
      <Route
        path="/app/admin-dashboard/edit-widget/:widgetId"
        element={<ProtectedRoute as={EditWidgetPage} requireAdmin={true} {...props} />}
      />
      <Route
        path="/app/admin-dashboard/create-widget"
        element={<ProtectedRoute as={CreateWidgetPage} requireAdmin={true} {...props} />}
      />
      <Route
        path="/app/admin-dashboard/foundry-maps"
        element={<ProtectedRoute as={FoundryMapsAdmin} requireAdmin={true} {...props} />}
      />
      <Route
        path="/app/user-dashboard"
        element={<ProtectedRoute as={UserDashboard} requireAdmin={false} {...props} />}
      />
      <Route path="*" element={<HomePage {...props} />} />
    </Routes>
  );
};

export default DMRoutes;
