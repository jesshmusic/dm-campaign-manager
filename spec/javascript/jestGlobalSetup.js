/**
 * Jest Global Setup (runs before test environment is created)
 * This polyfills HTMLFormElement.requestSubmit before jsdom initializes
 */

// This runs before jsdom creates the test environment
// We need to patch requestSubmit to avoid jsdom's "not implemented" error
if (typeof global.HTMLFormElement !== 'undefined') {
  global.HTMLFormElement.prototype.requestSubmit = function (submitter) {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    if (submitter) {
      Object.defineProperty(event, 'submitter', { value: submitter });
    }
    if (this.dispatchEvent(event)) {
      this.submit();
    }
  };
}
