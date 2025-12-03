import React, { useCallback } from 'react';
import { dashboardComponents, dashboardItems, initialLayouts } from '../../components/Widgets';
import { WidgetElementProps } from '../../components/Widgets/Widget';
import { getIconFromName } from '../../utilities/icons';
import CustomWidget from '../../components/Widgets/CustomWidget';

type LayoutItem = { i?: string; w?: number; h?: number; x?: number; y?: number };
type Layouts = Record<string, LayoutItem[]>;

/**
 * Checks if layouts contain corrupted items (w:1, h:1) in non-xxs breakpoints.
 * This can happen during initial render before the container is properly sized.
 * The xxs breakpoint legitimately has w:1 items, so it's excluded from the check.
 */
const hasCorruptedLayout = (layouts: Layouts, breakpoints = ['lg', 'md', 'sm', 'xs']): boolean => {
  return breakpoints.some((breakpoint) => {
    const breakpointLayout = layouts?.[breakpoint];
    return (
      Array.isArray(breakpointLayout) &&
      breakpointLayout.length > 0 &&
      breakpointLayout.some((item) => item.w === 1 && item.h === 1)
    );
  });
};

/**
 * Checks if a single layout item is corrupted (w:1, h:1).
 */
const isCorruptedItem = (item: LayoutItem): boolean => {
  return item.w === 1 && item.h === 1;
};

const getFromLS = (key: string) => {
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

          // Check for corrupted layouts (w:1, h:1 in any non-xxs breakpoint)
          if (hasCorruptedLayout(layouts)) return null;

          // Column counts for each breakpoint
          const colCounts = { lg: 12, md: 9, sm: 6, xs: 3, xxs: 1 };

          // Fix all widget sizes - ensure minimum dimensions
          Object.keys(layouts).forEach((breakpoint) => {
            const maxCols = colCounts[breakpoint] || 12;
            layouts[breakpoint] = layouts[breakpoint].map((item) => {
              const isCustomWidget = item.i && item.i.startsWith('customWidget');
              const widgetConfig = dashboardComponents[item.i];
              // Get minimum dimensions from widget config or use defaults
              // Cap minW to the breakpoint's column count
              const baseMinW = isCustomWidget ? 3 : widgetConfig?.grid?.minW || 3;
              const minW = Math.min(baseMinW, maxCols);
              const minH = isCustomWidget ? 3 : widgetConfig?.grid?.minH || 2;
              return {
                ...item,
                w: Math.max(Math.min(item.w || minW, maxCols), minW),
                h: Math.max(item.h || minH, minH),
                minW,
                minH,
              };
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

const saveToLS = (layouts: Layouts, widgets: string[]) => {
  if (global.localStorage) {
    // Don't save if any non-xxs breakpoint has items with w:1, h:1
    if (hasCorruptedLayout(layouts)) {
      return; // Skip saving corrupted layouts
    }
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

  const onLayoutChange = useCallback(
    (_currentLayout, allLayouts) => {
      // Column counts for each breakpoint
      const colCounts = { lg: 12, md: 9, sm: 6, xs: 3, xxs: 1 };

      setLayouts((prevLayouts) => {
        // Merge new layouts with previous, preserving user customizations
        const mergedLayouts = { ...prevLayouts };

        Object.keys(allLayouts).forEach((breakpoint) => {
          const newBreakpointLayout = allLayouts[breakpoint];
          const prevBreakpointLayout = prevLayouts[breakpoint] || [];
          const maxCols = colCounts[breakpoint] || 12;

          // Enforce minimum sizes for all widgets
          mergedLayouts[breakpoint] = newBreakpointLayout.map((item) => {
            const isCustomWidget = item.i && item.i.startsWith('customWidget');
            const widgetConfig = dashboardComponents[item.i];
            // Get minimum dimensions from widget config or use defaults
            // Cap minW to the breakpoint's column count
            const baseMinW = isCustomWidget ? 3 : widgetConfig?.grid?.minW || 3;
            const minW = Math.min(baseMinW, maxCols);
            const minH = isCustomWidget ? 3 : widgetConfig?.grid?.minH || 2;

            // Find existing item to preserve user customizations
            const existingItem = prevBreakpointLayout.find((prev) => prev.i === item.i);

            // If item exists and new layout has w:1,h:1 (corrupted), keep existing
            // but only if the existing item is not also corrupted
            if (
              existingItem &&
              isCorruptedItem(item) &&
              !isCorruptedItem(existingItem) &&
              breakpoint !== 'xxs'
            ) {
              return {
                ...existingItem,
                minW,
                minH,
              };
            }

            return {
              ...item,
              w: Math.max(Math.min(item.w || minW, maxCols), minW),
              h: Math.max(item.h || minH, minH),
              minW,
              minH,
            };
          });
        });

        return mergedLayouts;
      });
    },
    [setLayouts],
  );

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
