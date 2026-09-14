import '@testing-library/jest-dom/vitest';

// jsdom lacks matchMedia, which some libs / components reference
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// The api module touches localStorage at import time — jsdom provides it,
// but start each test file with a clean slate.
beforeEach(() => {
  localStorage.clear();
});