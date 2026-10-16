import { useEffect, useState } from 'react';

/**
 * Loads a list: null while loading, [] when loading fails or the response
 * isn't a list. Pass a stable function, such as a method of useCampaignApi's
 * memoized api, so it loads once.
 */
const useLoadedList = <T>(load: () => Promise<T[]>) => {
  const [items, setItems] = useState<T[] | null>(null);
  useEffect(() => {
    let current = true;
    load()
      .then((data) => current && setItems(Array.isArray(data) ? data : []))
      .catch(() => current && setItems([]));
    return () => {
      current = false;
    };
  }, [load]);
  return items;
};

export default useLoadedList;
