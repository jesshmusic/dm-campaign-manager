/**
 * Jest Test Setup
 * Runs before all tests to set up global mocks and utilities
 */

import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Polyfill TextEncoder/TextDecoder for jsdom
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Mock fetch globally for API tests
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    ok: true,
    status: 200,
  } as Response)
) as jest.Mock;

// Mock window.matchMedia (used by some UI components)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
} as any;

// Mock HTMLFormElement.requestSubmit (not implemented in jsdom)
HTMLFormElement.prototype.requestSubmit = function (submitter?: HTMLElement) {
  if (submitter) {
    const event = new Event('submit', { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'submitter', { value: submitter });
    this.dispatchEvent(event);
  } else {
    this.submit();
  }
};

// Suppress console errors in tests (optional - can be removed if you want to see errors)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.submit') ||
        args[0].includes('Not implemented: HTMLFormElement.prototype.requestSubmit'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
