import React from 'react';
import { render, act } from '@testing-library/react';
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
  let hookResult: any;

  // Helper component to test the hook
  const TestComponent = ({ customWidgets = [], getWidgets }: any) => {
    hookResult = useDashboardState({ customWidgets, getWidgets });
    return null;
  };

  beforeEach(() => {
    mockGetWidgets = jest.fn();
    localStorage.clear();
    jest.clearAllMocks();
    hookResult = null;
  });

  it('initializes with default widget keys', () => {
    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    expect(hookResult.widgetKeys).toEqual(['widget1', 'widget2']);
  });

  it('calls getWidgets on mount', () => {
    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

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

    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    expect(hookResult.widgetKeys).toEqual(['widget1']);
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

    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    expect(hookResult.layouts).toEqual(testLayouts);
  });

  it('adds a widget when onAddItem is called', () => {
    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    act(() => {
      hookResult.onAddItem('newWidget');
    });

    expect(hookResult.widgetKeys).toContain('newWidget');
  });

  it('removes a widget when onRemoveItem is called', () => {
    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    act(() => {
      hookResult.onRemoveItem('widget1');
    });

    expect(hookResult.widgetKeys).not.toContain('widget1');
    expect(hookResult.widgetKeys).toContain('widget2');
  });

  it('updates layouts when onLayoutChange is called', () => {
    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    const newLayouts = { lg: [{ i: 'widget1', x: 1, y: 1 }], md: [], sm: [] };

    act(() => {
      hookResult.onLayoutChange(null, newLayouts);
    });

    expect(hookResult.layouts).toEqual(newLayouts);
  });

  it('saves to localStorage when widget keys change', () => {
    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    act(() => {
      hookResult.onAddItem('newWidget');
    });

    const savedData = JSON.parse(localStorage.getItem('rgl-8') || '{}');
    expect(savedData.widgets).toContain('newWidget');
  });

  it('saves to localStorage when layouts change', () => {
    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    const newLayouts = { lg: [{ i: 'widget1', x: 2, y: 2 }], md: [], sm: [] };

    act(() => {
      hookResult.onLayoutChange(null, newLayouts);
    });

    const savedData = JSON.parse(localStorage.getItem('rgl-8') || '{}');
    expect(savedData.layouts).toEqual(newLayouts);
  });

  it('includes custom widgets in allWidgets', () => {
    const customWidgets = [
      { id: 1, icon: 'custom-icon', title: 'Custom Widget', subtitle: 'Custom Subtitle', content: '<p>Custom</p>' },
    ];

    render(<TestComponent customWidgets={customWidgets} getWidgets={mockGetWidgets} />);

    const customWidget = hookResult.allWidgets.find((w: any) => w.key === 'customWidget1');
    expect(customWidget).toBeDefined();
    expect(customWidget.title).toBe('Custom Widget');
  });

  it('includes custom widgets in widgets array when added', () => {
    const customWidgets = [
      { id: 1, icon: 'custom-icon', title: 'Custom Widget', subtitle: 'Custom Subtitle', content: '<p>Custom</p>' },
    ];

    render(<TestComponent customWidgets={customWidgets} getWidgets={mockGetWidgets} />);

    act(() => {
      hookResult.onAddItem('customWidget1');
    });

    const customWidget = hookResult.widgets.find((w: any) => w.widgetId === 'customWidget1');
    expect(customWidget).toBeDefined();
    expect(customWidget.title).toBe('Custom Widget');
    expect(customWidget.content).toBe('<p>Custom</p>');
  });

  it('handles invalid localStorage data gracefully', () => {
    localStorage.setItem('rgl-8', 'invalid json');

    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    expect(hookResult.widgetKeys).toEqual(['widget1', 'widget2']);
  });

  it('filters widgets based on widgetKeys', () => {
    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    act(() => {
      hookResult.onRemoveItem('widget2');
    });

    expect(hookResult.widgets.length).toBe(1);
    expect(hookResult.widgets[0].widgetId).toBe('widget1');
  });

  it('assigns onRemoveItem to each widget', () => {
    render(<TestComponent customWidgets={[]} getWidgets={mockGetWidgets} />);

    expect(hookResult.widgets[0].onRemoveItem).toBe(hookResult.onRemoveItem);
  });
});
