import { Route, Routes } from 'react-router-dom';
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

const DMRoutes = (props) => {
  return (
    <Routes>
      <Route path="/" element={<HomePage {...props} />} />
      <Route path="/app/classes/:dndClassSlug" element={<DndClass {...props} />} />
      <Route path="/app/classes" element={<DndClasses {...props} />} />
      <Route path="/app/races" element={<Races {...props} />} />
      <Route path="/app/races/:raceSlug" element={<Race {...props} />} />
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
      <Route path="/app/items/:itemSlug" element={<Item {...props} />} />
      <Route path="/app/monsters/" element={<Monsters {...props} />} />
      <Route path="/app/monsters/:monsterSlug" element={<Monster {...props} />} />
      <Route path="/app/spells/" element={<Spells {...props} />} />
      <Route path="/app/spells/:spellSlug" element={<Spell {...props} />} />
      <Route path="/app/rules" element={<RulesIndex {...props} />} />
      <Route path="/app/rules/:ruleSlug" element={<RulesCategory {...props} />} />
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
