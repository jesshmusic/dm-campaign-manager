import { createContext, useContext } from 'react';

// Sidebar dimensions
export const SIDEBAR_MIN_WIDTH = 320; // 20rem in pixels
export const SIDEBAR_COLLAPSED_WIDTH = 80; // 5rem in pixels
export const SIDEBAR_MAX_WIDTH = 400; // Maximum resize width

type SidebarContextType = {
  isCollapsed: boolean;
  sidebarWidth: number;
};

const SidebarContext = createContext<SidebarContextType>({
  isCollapsed: false,
  sidebarWidth: SIDEBAR_MIN_WIDTH,
});

export const SidebarProvider = SidebarContext.Provider;

export const useSidebar = () => useContext(SidebarContext);
