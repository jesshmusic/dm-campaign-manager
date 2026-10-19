import { useCallback, useEffect, useState } from 'react';
import { SetupGuide } from './setupSteps';

/**
 * Loads the setup guide's words. `guide` is null while loading or after an
 * error; `retry` loads again. Pass a stable function, such as useCampaignApi's
 * getSetupGuide, so it loads once.
 */
const useSetupGuide = (load: () => Promise<SetupGuide>) => {
  const [guide, setGuide] = useState<SetupGuide | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    setError(null);
    load()
      .then((data) => {
        if (current) setGuide(data);
      })
      .catch(() => {
        if (current) setError('Could not load the setup guide.');
      });
    return () => {
      current = false;
    };
  }, [load, attempt]);

  const retry = useCallback(() => {
    setGuide(null);
    setAttempt((count) => count + 1);
  }, []);

  return { guide, setGuide, error, retry };
};

export default useSetupGuide;
