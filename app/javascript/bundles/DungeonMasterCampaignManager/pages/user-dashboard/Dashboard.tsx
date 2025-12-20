import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { connect } from 'react-redux';
import rest from '../../api/api';
import Widget, { WidgetElementProps } from '../../components/Widgets/Widget';
import DashboardBar from './components/DashboardBar';
import { useDashboardState } from './use-dashboard-state';
import { createGlobalStyle } from 'styled-components';

const ResponsiveGridLayout = WidthProvider(Responsive);

import { Section } from './UserDashboard.styles';
import { RootState, AppDispatch } from '../../store/store';
import { WidgetProps } from '../../utilities/types';

const ResizeHandleStyles = createGlobalStyle`
  .react-resizable-handle {
    background-image: none !important;
  }

  .react-grid-item > .react-resizable-handle::after {
    width: 8px !important;
    height: 8px !important;
    right: 6px !important;
    bottom: 10px !important;
    border-right: 3px solid ${({ theme }) => theme.colors.gray500} !important;
    border-bottom: 3px solid ${({ theme }) => theme.colors.gray500} !important;
    transition: all 0.2s ease;
  }

  .react-grid-item > .react-resizable-handle:hover::after {
    border-right-color: ${({ theme }) => theme.colors.primary} !important;
    border-bottom-color: ${({ theme }) => theme.colors.primary} !important;
  }
`;

type DashboardProps = {
  customWidgets: WidgetProps[];
  getWidgets: () => void;
};

const Dashboard = ({ customWidgets, getWidgets }: DashboardProps) => {
  const {
    allWidgets,
    layouts,
    onAddItem,
    onLayoutChange,
    onRemoveItem,
    onResetLayout,
    widgetKeys,
    widgets,
  } = useDashboardState({ customWidgets, getWidgets });

  return (
    <Section id="dashboardContainer">
      <ResizeHandleStyles />
      <DashboardBar
        items={widgetKeys}
        onRemoveItem={onRemoveItem}
        onAddItem={onAddItem}
        onResetLayout={onResetLayout}
        widgets={allWidgets as any}
      />
      <ResponsiveGridLayout
        autoSize={true}
        className="layout"
        layouts={layouts}
        breakpoints={{ lg: 1500, md: 1200, sm: 900, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 9, sm: 6, xs: 3, xxs: 1 }}
        rowHeight={80}
        draggableHandle=".widget-drag-handle"
        draggableCancel="button, input, textarea, select, a, .no-drag"
        onLayoutChange={onLayoutChange}
      >
        {widgets.map((widget: WidgetElementProps) => (
          <div key={widget.widgetId} className="widget">
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
    </Section>
  );
};

function mapStateToProps(state: RootState) {
  return {
    currentUser: state.users.currentUser,
    customWidgets: state.widgets.widgets,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getWidgets: () => {
      dispatch(rest.actions.getWidgets());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
