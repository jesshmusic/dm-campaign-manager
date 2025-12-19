import { Route, Routes, useParams } from 'react-router-dom';
import HomePage from '../pages/front-page/HomePage';
import DndClasses from '../pages/dnd-classes/DndClasses';
import Races from '../pages/races/Races';
import Race from '../pages/races/Race';
import Util from '../utilities/utilities';
import Items from '../pages/items/Items';
import Item from '../pages/items/Item';
import Monsters from '../pages/monsters/Monsters';
import Monster from '../pages/monsters/Monster';
import Spells from '../pages/spells/Spells';
import Spell from '../pages/spells/Spell';
// Rule component is now rendered by RulesCategory
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
import React from 'react';
import DndClass from '../pages/dnd-classes/DndClass';
import CreateWidgetPage from '../pages/admin-dashboard/CreateWidgetPage';
import CreateCustomActionPage from '../pages/admin-dashboard/CreateCustomActionPage';
import EditWidgetPage from '../pages/admin-dashboard/EditWidgetPage';
import SearchResults from '../pages/search-results/SearchResults';
import PrivacyPolicy from '../pages/privacy-policy/PrivacyPolicy';
import FoundryMapsAdmin from '../pages/FoundryMapsAdmin';
import { isValidEdition } from '../utilities/editionUrls';

// Resolver components that determine if single param is edition or slug
const ClassesResolver = (props) => {
  const { param } = useParams<{ param: string }>();
  return isValidEdition(param) ? <DndClasses {...props} /> : <DndClass {...props} />;
};

const RacesResolver = (props) => {
  const { param } = useParams<{ param: string }>();
  return isValidEdition(param) ? <Races {...props} /> : <Race {...props} />;
};

const MonstersResolver = (props) => {
  const { param } = useParams<{ param: string }>();
  return isValidEdition(param) ? <Monsters {...props} /> : <Monster {...props} />;
};

const SpellsResolver = (props) => {
  const { param } = useParams<{ param: string }>();
  return isValidEdition(param) ? <Spells {...props} /> : <Spell {...props} />;
};

const RulesResolver = (props) => {
  const { param } = useParams<{ param: string }>();
  // Special case: rules-glossary goes to RulesGlossary even without edition
  if (param === 'rules-glossary') {
    return <RulesGlossary {...props} />;
  }
  return isValidEdition(param) ? <RulesIndex {...props} /> : <RulesCategory {...props} />;
};

const BackgroundsResolver = (props) => {
  const { param } = useParams<{ param: string }>();
  return isValidEdition(param) ? <BackgroundsIndex {...props} /> : <BackgroundDetail {...props} />;
};

const FeatsResolver = (props) => {
  const { param } = useParams<{ param: string }>();
  return isValidEdition(param) ? <FeatsIndex {...props} /> : <FeatDetail {...props} />;
};

const DMRoutes = (props) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage {...props} />} />

      {/* Classes - edition-aware routes */}
      <Route path="/app/classes/:edition/:dndClassSlug" element={<DndClass {...props} />} />
      <Route path="/app/classes/:param" element={<ClassesResolver {...props} />} />
      <Route path="/app/classes" element={<DndClasses {...props} />} />

      {/* Races - edition-aware routes */}
      <Route path="/app/races/:edition/:raceSlug" element={<Race {...props} />} />
      <Route path="/app/races/:param" element={<RacesResolver {...props} />} />
      <Route path="/app/races" element={<Races {...props} />} />

      {/* Items - category pages (no edition needed) */}
      {Util.itemPages.map((itemPage) => (
        <Route
          path={itemPage.path}
          key={itemPage.itemType}
          element={
            <Items
              {...props}
              key={itemPage.itemType}
              itemType={itemPage.itemType}
              pageTitle={itemPage.pageTitle}
            />
          }
        />
      ))}
      {/* Items - edition-aware detail routes */}
      <Route path="/app/items/:edition/:itemSlug" element={<Item {...props} />} />
      <Route path="/app/items/:itemSlug" element={<Item {...props} />} />

      {/* Monsters - edition-aware routes */}
      <Route path="/app/monsters/:edition/:monsterSlug" element={<Monster {...props} />} />
      <Route path="/app/monsters/:param" element={<MonstersResolver {...props} />} />
      <Route path="/app/monsters" element={<Monsters {...props} />} />

      {/* Spells - edition-aware routes */}
      <Route path="/app/spells/:edition/:spellSlug" element={<Spell {...props} />} />
      <Route path="/app/spells/:param" element={<SpellsResolver {...props} />} />
      <Route path="/app/spells" element={<Spells {...props} />} />

      {/* Rules - edition-aware routes */}
      <Route path="/app/rules/:edition/rules-glossary" element={<RulesGlossary {...props} />} />
      <Route path="/app/rules/:edition/:ruleSlug" element={<RulesCategory {...props} />} />
      <Route path="/app/rules/:param" element={<RulesResolver {...props} />} />
      <Route path="/app/rules" element={<RulesIndex {...props} />} />

      {/* Backgrounds - edition-aware routes */}
      <Route
        path="/app/backgrounds/:edition/:backgroundSlug"
        element={<BackgroundDetail {...props} />}
      />
      <Route path="/app/backgrounds/:param" element={<BackgroundsResolver {...props} />} />
      <Route path="/app/backgrounds" element={<BackgroundsIndex {...props} />} />

      {/* Feats - edition-aware routes */}
      <Route path="/app/feats/:edition/:featSlug" element={<FeatDetail {...props} />} />
      <Route path="/app/feats/:param" element={<FeatsResolver {...props} />} />
      <Route path="/app/feats" element={<FeatsIndex {...props} />} />

      {/* Other routes (no edition needed) */}
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
