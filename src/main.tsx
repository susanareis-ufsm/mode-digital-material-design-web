import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Guard against benign ResizeObserver loop completion notifications in Chromium / iframes
if (typeof window !== 'undefined') {
  const isResizeError = (e: unknown) => {
    if (!e) return false;
    const msg =
      typeof e === 'string'
        ? e
        : (e as { message?: string }).message ||
          (e as { error?: { message?: string } }).error?.message ||
          '';
    return (
      typeof msg === 'string' &&
      (msg.includes('ResizeObserver loop completed with undelivered notifications') ||
        msg.includes('ResizeObserver loop limit exceeded'))
    );
  };

  window.addEventListener(
    'error',
    (event) => {
      if (isResizeError(event)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );

  window.addEventListener(
    'unhandledrejection',
    (event) => {
      if (isResizeError(event.reason)) {
        event.stopImmediatePropagation();
        event.preventDefault();
      }
    },
    true
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
