// Defensive wrapper to guarantee window.fetch has both getter & setter in strict mode
try {
  const currentFetch = typeof window.fetch === 'function' ? window.fetch.bind(window) : window.fetch;
  let fetchRef = currentFetch;
  if (typeof Window !== 'undefined' && Window.prototype) {
    const protoDesc = Object.getOwnPropertyDescriptor(Window.prototype, 'fetch');
    if (protoDesc && !protoDesc.set && protoDesc.configurable) {
      Object.defineProperty(Window.prototype, 'fetch', {
        get() { return fetchRef; },
        set(fn) { fetchRef = fn; },
        configurable: true,
        enumerable: true,
      });
    }
  }
  const winDesc = Object.getOwnPropertyDescriptor(window, 'fetch');
  if (!winDesc || winDesc.configurable) {
    Object.defineProperty(window, 'fetch', {
      get() { return fetchRef; },
      set(fn) { fetchRef = fn; },
      configurable: true,
      enumerable: true,
    });
  }
} catch {
  // Ignore in restricted environments
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
