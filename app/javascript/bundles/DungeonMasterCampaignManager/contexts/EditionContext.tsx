import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getEditionFromPath, isValidEdition, DndEdition } from '../utilities/editionUrls';

export type { DndEdition } from '../utilities/editionUrls';

const STORAGE_KEY = 'dnd-edition';
const DEFAULT_EDITION: DndEdition = '2024';

type EditionContextType = {
  edition: DndEdition;
  setEdition: (edition: DndEdition) => void;
  isEdition2024: boolean;
  isEdition2014: boolean;
  /** Edition from URL, or null if not in URL */
  urlEdition: DndEdition | null;
};

const EditionContext = createContext<EditionContextType>({
  edition: DEFAULT_EDITION,
  setEdition: () => {},
  isEdition2024: true,
  isEdition2014: false,
  urlEdition: null,
});

type EditionProviderProps = {
  children: ReactNode;
  initialEdition?: DndEdition;
};

export const EditionProvider: React.FC<EditionProviderProps> = ({ children, initialEdition }) => {
  const location = useLocation();
  const navigate = useNavigate();

  // Get edition from URL if present
  const urlEdition = getEditionFromPath(location.pathname);

  const [storedEdition, setStoredEdition] = useState<DndEdition>(() => {
    // Priority: initialEdition prop > localStorage > default
    if (initialEdition) {
      return initialEdition;
    }

    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY) as DndEdition | null;
      if (stored === '2014' || stored === '2024') {
        return stored;
      }
    }

    return DEFAULT_EDITION;
  });

  // Effective edition: URL edition takes priority, then stored preference
  const edition: DndEdition = urlEdition || storedEdition;

  const setEdition = useCallback(
    (newEdition: DndEdition) => {
      // Update stored preference
      setStoredEdition(newEdition);

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, newEdition);
      }

      // If we're on an edition-aware URL, update the URL to reflect the new edition
      if (urlEdition && urlEdition !== newEdition) {
        const currentPath = location.pathname;
        // Replace the edition in the URL path
        // URL pattern: /app/{type}/{edition}/{slug} or /app/{type}/{edition}
        const parts = currentPath.split('/');
        if (parts.length >= 4 && isValidEdition(parts[3])) {
          parts[3] = newEdition;
          const newPath = parts.join('/');
          navigate(newPath, { replace: true });
        }
      }
    },
    [urlEdition, location.pathname, navigate],
  );

  // Sync to localStorage on mount if initial value was from prop
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, storedEdition);
    }
  }, [storedEdition]);

  // When URL edition changes, update stored preference to match
  useEffect(() => {
    if (urlEdition && urlEdition !== storedEdition) {
      setStoredEdition(urlEdition);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, urlEdition);
      }
    }
  }, [urlEdition, storedEdition]);

  const value: EditionContextType = {
    edition,
    setEdition,
    isEdition2024: edition === '2024',
    isEdition2014: edition === '2014',
    urlEdition,
  };

  return <EditionContext.Provider value={value}>{children}</EditionContext.Provider>;
};

export const useEdition = (): EditionContextType => {
  const context = useContext(EditionContext);
  if (!context) {
    throw new Error('useEdition must be used within an EditionProvider');
  }
  return context;
};

export default EditionContext;
