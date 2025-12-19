import { createContext, useContext } from 'react';

// Sidebar dimensions in rem (converted to pixels for calculations)
const REM_TO_PX = 16;
export const SIDEBAR_MIN_WIDTH_REM = 20;
export const SIDEBAR_COLLAPSED_WIDTH_REM = 5;
export const SIDEBAR_MAX_WIDTH_REM = 30;

// Pixel values for calculations (mouse events return pixels)
export const SIDEBAR_MIN_WIDTH = SIDEBAR_MIN_WIDTH_REM * REM_TO_PX; // 320px
export const SIDEBAR_COLLAPSED_WIDTH = SIDEBAR_COLLAPSED_WIDTH_REM * REM_TO_PX; // 80px
export const SIDEBAR_MAX_WIDTH = SIDEBAR_MAX_WIDTH_REM * REM_TO_PX; // 480px

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
