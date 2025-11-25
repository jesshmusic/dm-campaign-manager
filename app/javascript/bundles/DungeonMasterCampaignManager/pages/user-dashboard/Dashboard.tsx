import React from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { connect } from 'react-redux';
import rest from '../../api/api';
import Widget from '../../components/Widgets/Widget';
import DashboardBar from './components/DashboardBar';
import { useDashboardState } from './use-dashboard-state';

const ResponsiveGridLayout = WidthProvider(Responsive);

import styles from './user-dashboard.module.scss';

const Dashboard = ({ customWidgets, getWidgets }) => {
  const { allWidgets, layouts, onAddItem, onLayoutChange, onRemoveItem, widgetKeys, widgets } =
    useDashboardState({ customWidgets, getWidgets });

  return (
    <div className={styles.section} id="dashboardContainer">
      <DashboardBar
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
