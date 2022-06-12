import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { connect } from 'react-redux';
import rest from '../../api/api';
import Widget, { WidgetElementProps } from '../../components/Widgets/Widget';
import DashboardBar from './components/DashboardBar';
import { dashboardComponents, dashboardItems, initialLayouts } from '../../components/Widgets';
import { GiBeerStein } from 'react-icons/all';
import { allGiIcons } from '../admin-dashboard/CreateWidgetPage';
import CustomWidget from '../../components/Widgets/CustomWidget';

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

const Dashboard = ({ customWidgets, getWidgets }) => {
  const [widgetKeys, setWidgetKeys] = React.useState(['randomName', 'randomTavern', 'npcGen']);
  const [widgets, setWidgets] = React.useState<WidgetElementProps[]>([]);
  const [layouts, setLayouts] = React.useState(initialLayouts);
  const [allWidgets, setAllWidgets] = React.useState(dashboardItems);

  React.useEffect(() => {
    setLayouts(getFromLS('layouts') || initialLayouts);
    setWidgetKeys(getFromLS('widgets'));
    getWidgets();
  }, []);

  React.useEffect(() => {
    saveToLS('widgets', widgetKeys);
  }, [widgetKeys]);

  React.useEffect(() => {
    const customWidgetKeys = customWidgets.map((widget) => ({
      key: `customWidget${widget.id}`,
      title: widget.title,
    }));
    const builtInKeys = dashboardItems.map((item) => ({
      key: item,
      title: dashboardComponents[item].title,
    }));
    setAllWidgets([...builtInKeys, ...customWidgetKeys]);
  }, [customWidgets]);

  React.useEffect(() => {
    const builtInWidgets = dashboardItems.map((key) => {
      const builtInWidget = dashboardComponents[key];
      return {
        widgetId: key,
        icon: builtInWidget.icon,
        component: builtInWidget.component,
        onRemoveItem: onRemoveItem,
        hideFrame: false,
        title: builtInWidget.title,
        subtitle: builtInWidget.subtitle,
        dataGrid: builtInWidget.grid,
      };
    });
    const cstmWidgets = customWidgets.map((widget, index) => {
      return {
        widgetId: `customWidget${widget.id}`,
        icon: getIconFromName(widget.icon),
        component: CustomWidget,
        onRemoveItem: onRemoveItem,
        hideFrame: false,
        title: widget.title,
        subtitle: widget.subtitle,
        content: widget.content,
        dataGrid: { w: 4, h: 3, x: index * 4, y: Infinity, minW: 4, minH: 3 },
      };
    });
    const combinedWidgets = [...builtInWidgets, ...cstmWidgets].filter((widget) => {
      return widgetKeys.findIndex((value) => value === widget.widgetId) !== -1;
    });
    setWidgets(combinedWidgets);
  }, [customWidgets, widgetKeys]);

  const onLayoutChange = (currentLayouts, allLayouts) => {
    setLayouts(allLayouts);
  };

  const onLayoutSave = () => {
    saveToLS('layouts', layouts);
  };

  const onRemoveItem = (widgetId) => {
    setWidgetKeys(widgetKeys.filter((i) => i !== widgetId));
  };

  const onAddItem = (widgetId) => {
    setWidgetKeys([...widgetKeys, widgetId]);
  };

  const getIconFromName = (name: string) => {
    const icon = allGiIcons.find((icon) => icon.value === name);
    return icon?.icon || <GiBeerStein />;
  };

  return (
    <div className={styles.section} id="dashboardContainer">
      <DashboardBar
        onLayoutSave={onLayoutSave}
        items={widgetKeys}
        onRemoveItem={onRemoveItem}
        onAddItem={onAddItem}
        widgets={allWidgets}
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
        {widgets.map((widget) => (
          <div key={widget.widgetId} className="widget" data-grid={widget.dataGrid}>
            <Widget
              icon={widget.icon}
              widgetId={widget.widgetId}
              onRemoveItem={onRemoveItem}
              component={widget.component}
              hideFrame={true}
              title={widget.title}
              subtitle={widget.subtitle}
              content={widget.content}
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
    customWidgets: state.widgets.widgets,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getWidgets: () => {
      dispatch(rest.actions.getWidgets());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
