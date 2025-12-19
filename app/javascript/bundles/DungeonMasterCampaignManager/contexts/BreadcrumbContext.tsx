import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type BreadcrumbPathItem = {
  title: string;
  url: string;
};

type BreadcrumbContextType = {
  customPaths: BreadcrumbPathItem[] | undefined;
  setCustomPaths: (paths: BreadcrumbPathItem[] | undefined) => void;
};

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: React.ReactNode }) => {
  const [customPaths, setCustomPathsState] = useState<BreadcrumbPathItem[] | undefined>(undefined);

  const setCustomPaths = useCallback((paths: BreadcrumbPathItem[] | undefined) => {
    setCustomPathsState(paths);
  }, []);

  const value = useMemo(() => ({ customPaths, setCustomPaths }), [customPaths, setCustomPaths]);

  return <BreadcrumbContext.Provider value={value}>{children}</BreadcrumbContext.Provider>;
};

export const useBreadcrumbs = () => {
  const context = useContext(BreadcrumbContext);
  if (!context) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbProvider');
  }
  return context;
};
