import { createContext, useContext } from 'react';

type SidebarContextType = {
  isCollapsed: boolean;
};

const SidebarContext = createContext<SidebarContextType>({ isCollapsed: false });

export const SidebarProvider = SidebarContext.Provider;

export const useSidebar = () => useContext(SidebarContext);
