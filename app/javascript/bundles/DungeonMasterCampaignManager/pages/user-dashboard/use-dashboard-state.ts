import React from 'react';
import { dashboardComponents, dashboardItems, initialLayouts } from '../../components/Widgets';
import { WidgetElementProps } from '../../components/Widgets/Widget';
import { getIconFromName } from '../../utilities/icons';
import CustomWidget from '../../components/Widgets/CustomWidget';

const getFromLS = (key) => {
  let ls = {};
  if (global.localStorage) {
    try {
      ls = JSON.parse(global.localStorage.getItem('rgl-8') as string) || {};
    } catch (e) {}
  }
  return ls[key];
};

const saveToLS = (layouts, widgets) => {
  if (global.localStorage) {
    global.localStorage.setItem(
      'rgl-8',
      JSON.stringify({
        layouts,
        widgets,
      })
    );
  }
};

export const useDashboardState = ({ customWidgets, getWidgets }) => {
  const [widgetKeys, setWidgetKeys] = React.useState(getFromLS('widgets') || dashboardItems);
  const [widgets, setWidgets] = React.useState<WidgetElementProps[]>([]);
  const [layouts, setLayouts] = React.useState(getFromLS('layouts') || initialLayouts);
  const [allWidgets, setAllWidgets] = React.useState(dashboardItems);

  React.useEffect(() => {
    getWidgets();
  }, []);

  React.useEffect(() => {
    saveToLS(layouts, widgetKeys);
  }, [widgetKeys]);

  React.useEffect(() => {
    saveToLS(layouts, widgetKeys);
  }, [layouts]);

  React.useEffect(() => {
    const customWidgetKeys = customWidgets.map((widget) => ({
      key: `customWidget${widget.id}`,
      icon: getIconFromName(widget.icon),
      title: widget.title,
    }));
    const builtInKeys = dashboardItems.map((widget) => ({
      key: widget,
      icon: dashboardComponents[widget].icon,
      title: dashboardComponents[widget].title,
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

  const onRemoveItem = (widgetId) => {
    setWidgetKeys(widgetKeys.filter((i) => i !== widgetId));
  };

  const onAddItem = (widgetId) => {
    setWidgetKeys([...widgetKeys, widgetId]);
  };

  return { allWidgets, layouts, onAddItem, onLayoutChange, onRemoveItem, widgetKeys, widgets };
};
