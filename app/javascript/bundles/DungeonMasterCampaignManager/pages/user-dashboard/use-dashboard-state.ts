import React, { useCallback } from 'react';
import { dashboardComponents, dashboardItems, initialLayouts } from '../../components/Widgets';
import { WidgetElementProps } from '../../components/Widgets/Widget';
import { getIconFromName } from '../../utilities/icons';
import CustomWidget from '../../components/Widgets/CustomWidget';

const getFromLS = (key) => {
  if (global.localStorage) {
    try {
      const ls = JSON.parse(global.localStorage.getItem('rgl-8') as string);
      if (ls && ls[key]) {
        // For layouts, ensure it has at least one breakpoint with items
        // and fix any custom widgets with invalid sizes
        if (key === 'layouts') {
          const layouts = ls[key];
          const hasValidLayout = Object.values(layouts).some(
            (breakpointLayout: unknown) =>
              Array.isArray(breakpointLayout) && breakpointLayout.length > 0,
          );
          if (!hasValidLayout) return null;
          // Fix custom widget sizes - ensure minimum 3x3
          Object.keys(layouts).forEach((breakpoint) => {
            layouts[breakpoint] = layouts[breakpoint].map((item) => {
              if (item.i && item.i.startsWith('customWidget')) {
                return {
                  ...item,
                  w: Math.max(item.w || 3, 3),
                  h: Math.max(item.h || 3, 3),
                  minW: 3,
                  minH: 3,
                };
              }
              return item;
            });
          });
          return layouts;
        }
        return ls[key];
      }
    } catch (_e) {
      // Ignore JSON parse errors
    }
  }
  return null;
};

const saveToLS = (layouts, widgets) => {
  if (global.localStorage) {
    global.localStorage.setItem(
      'rgl-8',
      JSON.stringify({
        layouts,
        widgets,
      }),
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
        dataGrid: { w: 4, h: 3, x: index * 4, y: Infinity, minW: 3, minH: 3 },
      };
    });
    const combinedWidgets = [...builtInWidgets, ...cstmWidgets].filter((widget) => {
      return widgetKeys.findIndex((value) => value === widget.widgetId) !== -1;
    });
    setWidgets(combinedWidgets);
  }, [customWidgets, widgetKeys]);

  const onLayoutChange = useCallback((_currentLayout, allLayouts) => {
    // Enforce minimum 3x3 for custom widgets
    const fixedLayouts = { ...allLayouts };
    Object.keys(fixedLayouts).forEach((breakpoint) => {
      fixedLayouts[breakpoint] = fixedLayouts[breakpoint].map((item) => {
        if (item.i && item.i.startsWith('customWidget')) {
          return {
            ...item,
            w: Math.max(item.w || 3, 3),
            h: Math.max(item.h || 3, 3),
            minW: 3,
            minH: 3,
          };
        }
        return item;
      });
    });
    setLayouts(fixedLayouts);
  }, []);

  const onRemoveItem = useCallback((widgetId) => {
    setWidgetKeys((prev) => prev.filter((i) => i !== widgetId));
  }, []);

  const onAddItem = useCallback(
    (widgetId) => {
      setWidgetKeys((prev) => [...prev, widgetId]);
      // Add layout entry for the new widget
      const isCustomWidget = widgetId.startsWith('customWidget');
      const widgetConfig = dashboardComponents[widgetId];
      // Custom widgets get minimum 3x3, built-in widgets use their defined grid
      const gridConfig = isCustomWidget
        ? { w: 4, h: 3, minW: 3, minH: 3 }
        : widgetConfig?.grid || { w: 4, h: 3, minW: 3, minH: 3 };
      const newLayoutItem = {
        i: widgetId,
        x: 0,
        y: Infinity,
        w: gridConfig.w || 4,
        h: gridConfig.h || 3,
        minW: isCustomWidget ? 3 : gridConfig.minW || 3,
        minH: isCustomWidget ? 3 : gridConfig.minH || 3,
      };
      setLayouts((prev) => {
        const updated = { ...prev };
        Object.keys(updated).forEach((breakpoint) => {
          if (!updated[breakpoint].find((item) => item.i === widgetId)) {
            updated[breakpoint] = [...updated[breakpoint], { ...newLayoutItem }];
          }
        });
        return updated;
      });
    },
    [setWidgetKeys, setLayouts],
  );

  const onResetLayout = useCallback(() => {
    setLayouts(initialLayouts);
    setWidgetKeys(dashboardItems);
  }, []);

  return {
    allWidgets,
    layouts,
    onAddItem,
    onLayoutChange,
    onRemoveItem,
    onResetLayout,
    widgetKeys,
    widgets,
  };
};
