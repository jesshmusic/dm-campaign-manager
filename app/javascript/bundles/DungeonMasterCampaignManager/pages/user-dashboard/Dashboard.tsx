import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { connect } from 'react-redux';
import Widget from '../../components/Widgets/Widget';
import DashboardBar from './components/DashboardBar';
import { dashboardComponents, dashboardItems, initialLayouts } from '../../components/Widgets';

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

const Dashboard = () => {
  const [items, setItems] = React.useState(['randomName', 'randomTavern', 'npcGen']);
  const [layouts, setLayouts] = React.useState(initialLayouts);

  React.useEffect(() => {
    setLayouts(getFromLS('layouts') || initialLayouts);
  }, []);

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
    <div className={styles.section} id="dashboardContainer">
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
        cols={{ lg: 12, md: 9, sm: 6, xs: 3, xxs: 1 }}
        rowHeight={100}
        onLayoutChange={onLayoutChange}
      >
        {items.map((key) => (
          <div key={key} className="widget" data-grid={dashboardComponents[key].grid}>
            <Widget
              icon={dashboardComponents[key].icon}
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
