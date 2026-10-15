/**
 * Full-page navigation to another site, e.g. an OAuth provider.
 * Wrapped in a module so tests can mock it (jsdom can't navigate).
 */
const navigateTo = (url: string) => {
  window.location.assign(url);
};

export default navigateTo;
