import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import NameField from '../../components/Widgets/NameField';
import TavernNameField from '../../components/Widgets/TavernNameField';
import { connect } from 'react-redux';
import NPCGenButton from '../../components/Widgets/NPCGenButton';
import Widget from '../../components/Widgets/Widget';
import DashboardBar from './components/DashboardBar';

const ResponsiveGridLayout = WidthProvider(Responsive);

const styles = require('./user-dashboard.module.scss');

const getFromLS = (key) => {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8') as string) || {};
    } catch (e) {}
  }
  return ls[key];
};
const saveToLS = (key, value) => {
  if (global.localStorage) {
    global.localStorage.setItem(
      'rgl-8',
      JSON.stringify({
        [key]: value,
      })
    );
  }
};

const dashboardItems = ['randomName', 'randomTavern', 'npcGen'];

const initialLayouts = {
  lg: [
    { i: 'randomName', x: 0, y: 0, w: 1, h: 1, minW: 3, minH: 3 },
    { i: 'randomTavern', x: 1, y: 0, w: 1, h: 1, minW: 3, minH: 3 },
    { i: 'npcGen', x: 2, y: 0, w: 3, h: 1, minW: 3, minH: 3 },
  ],
};

export const dashboardComponents: {
  [key: string]: {
    component: React.ReactNode;
    title: string;
    subtitle: string;
    grid: object;
  };
} = {
  randomName: {
    component: NameField,
    title: 'Random Character Name',
    subtitle: 'Generate a random fantasy name based on gender and race',
    grid: { w: 4, h: 3, x: 0, y: Infinity, minW: 4, minH: 3 },
  },
  randomTavern: {
    component: TavernNameField,
    title: 'Random Tavern Name',
    subtitle: 'Generate a random tavern name',
    grid: { w: 3, h: 3, x: 4, y: Infinity, minW: 3, minH: 3 },
  },
  npcGen: {
    component: NPCGenButton,
    title: 'NPC Generator',
    subtitle: 'Quickly create custom NPCs of any challenge rating',
    grid: { w: 2, h: 2, x: 0, y: Infinity, minW: 2, minH: 2 },
  },
};

const Dashboard = () => {
  const [items, setItems] = React.useState(dashboardItems);
  const [layouts, setLayouts] = React.useState(getFromLS('layouts') || initialLayouts);
  const onLayoutChange = (currentLayouts, allLayouts) => {
    setLayouts(allLayouts);
  };
  const onLayoutSave = () => {
    saveToLS('layouts', layouts);
  };
  const onRemoveItem = (itemId) => {
    setItems(items.filter((i) => i !== itemId));
  };
  const onAddItem = (itemId) => {
    setItems([...items, itemId]);
  };

  return (
    <div className={styles.section}>
      <DashboardBar
        onLayoutSave={onLayoutSave}
        items={items}
        onRemoveItem={onRemoveItem}
        onAddItem={onAddItem}
        originalItems={dashboardItems}
      />
      <ResponsiveGridLayout
        autoSize={true}
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1500, md: 1200, sm: 900, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 9, sm: 6, xs: 3, xxs: 3 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
      >
        {items.map((key) => (
          <div key={key} className="widget" data-grid={dashboardComponents[key].grid}>
            <Widget
              id={key}
              onRemoveItem={onRemoveItem}
              component={dashboardComponents[key].component}
              hideFrame={true}
              title={dashboardComponents[key].title}
              subtitle={dashboardComponents[key].subtitle}
            />
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
