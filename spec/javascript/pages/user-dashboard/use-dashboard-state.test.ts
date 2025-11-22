import { renderHook, act } from '@testing-library/react';
import { useDashboardState } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/user-dashboard/use-dashboard-state';

// Mock dashboard components
jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets', () => ({
  dashboardComponents: {
    widget1: {
      icon: 'icon1',
      component: () => null,
      title: 'Widget 1',
      subtitle: 'Subtitle 1',
      grid: { w: 4, h: 3, x: 0, y: 0, minW: 4, minH: 3 },
    },
    widget2: {
      icon: 'icon2',
      component: () => null,
      title: 'Widget 2',
      subtitle: 'Subtitle 2',
      grid: { w: 4, h: 3, x: 4, y: 0, minW: 4, minH: 3 },
    },
  },
  dashboardItems: ['widget1', 'widget2'],
  initialLayouts: { lg: [], md: [], sm: [] },
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/icons', () => ({
  getIconFromName: jest.fn((name) => `icon-${name}`),
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/CustomWidget', () => ({
  __esModule: true,
  default: () => null,
}));

describe('useDashboardState', () => {
  let mockGetWidgets: jest.Mock;

  beforeEach(() => {
    mockGetWidgets = jest.fn();
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('initializes with default widget keys', () => {
    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    expect(result.current.widgetKeys).toEqual(['widget1', 'widget2']);
  });

  it('calls getWidgets on mount', () => {
    renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    expect(mockGetWidgets).toHaveBeenCalledTimes(1);
  });

  it('loads widget keys from localStorage if available', () => {
    localStorage.setItem(
      'rgl-8',
      JSON.stringify({
        widgets: ['widget1'],
        layouts: {},
      })
    );

    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    expect(result.current.widgetKeys).toEqual(['widget1']);
  });

  it('loads layouts from localStorage if available', () => {
    const testLayouts = { lg: [{ i: 'widget1', x: 0, y: 0 }], md: [], sm: [] };
    localStorage.setItem(
      'rgl-8',
      JSON.stringify({
        widgets: ['widget1'],
        layouts: testLayouts,
      })
    );

    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    expect(result.current.layouts).toEqual(testLayouts);
  });

  it('adds a widget when onAddItem is called', () => {
    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    act(() => {
      result.current.onAddItem('newWidget');
    });

    expect(result.current.widgetKeys).toContain('newWidget');
  });

  it('removes a widget when onRemoveItem is called', () => {
    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    act(() => {
      result.current.onRemoveItem('widget1');
    });

    expect(result.current.widgetKeys).not.toContain('widget1');
    expect(result.current.widgetKeys).toContain('widget2');
  });

  it('updates layouts when onLayoutChange is called', () => {
    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    const newLayouts = { lg: [{ i: 'widget1', x: 1, y: 1 }], md: [], sm: [] };

    act(() => {
      result.current.onLayoutChange(null, newLayouts);
    });

    expect(result.current.layouts).toEqual(newLayouts);
  });

  it('saves to localStorage when widget keys change', () => {
    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    act(() => {
      result.current.onAddItem('newWidget');
    });

    const savedData = JSON.parse(localStorage.getItem('rgl-8') || '{}');
    expect(savedData.widgets).toContain('newWidget');
  });

  it('saves to localStorage when layouts change', () => {
    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    const newLayouts = { lg: [{ i: 'widget1', x: 2, y: 2 }], md: [], sm: [] };

    act(() => {
      result.current.onLayoutChange(null, newLayouts);
    });

    const savedData = JSON.parse(localStorage.getItem('rgl-8') || '{}');
    expect(savedData.layouts).toEqual(newLayouts);
  });

  it('includes custom widgets in allWidgets', () => {
    const customWidgets = [
      { id: 1, icon: 'custom-icon', title: 'Custom Widget', subtitle: 'Custom Subtitle', content: '<p>Custom</p>' },
    ];

    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets,
        getWidgets: mockGetWidgets,
      })
    );

    const customWidget = result.current.allWidgets.find((w: any) => w.key === 'customWidget1');
    expect(customWidget).toBeDefined();
    expect(customWidget.title).toBe('Custom Widget');
  });

  it('includes custom widgets in widgets array when added', () => {
    const customWidgets = [
      { id: 1, icon: 'custom-icon', title: 'Custom Widget', subtitle: 'Custom Subtitle', content: '<p>Custom</p>' },
    ];

    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets,
        getWidgets: mockGetWidgets,
      })
    );

    act(() => {
      result.current.onAddItem('customWidget1');
    });

    const customWidget = result.current.widgets.find((w: any) => w.widgetId === 'customWidget1');
    expect(customWidget).toBeDefined();
    expect(customWidget.title).toBe('Custom Widget');
    expect(customWidget.content).toBe('<p>Custom</p>');
  });

  it('handles invalid localStorage data gracefully', () => {
    localStorage.setItem('rgl-8', 'invalid json');

    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    expect(result.current.widgetKeys).toEqual(['widget1', 'widget2']);
  });

  it('filters widgets based on widgetKeys', () => {
    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    act(() => {
      result.current.onRemoveItem('widget2');
    });

    expect(result.current.widgets.length).toBe(1);
    expect(result.current.widgets[0].widgetId).toBe('widget1');
  });

  it('assigns onRemoveItem to each widget', () => {
    const { result } = renderHook(() =>
      useDashboardState({
        customWidgets: [],
        getWidgets: mockGetWidgets,
      })
    );

    expect(result.current.widgets[0].onRemoveItem).toBe(result.current.onRemoveItem);
  });
});
