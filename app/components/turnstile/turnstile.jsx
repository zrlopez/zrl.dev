import { useEffect, useRef, useState } from 'react';
import styles from './turnstile.module.css';

const SCRIPT_ID = 'cf-turnstile-script';
const SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
const MAX_ATTEMPTS = 50;

function loadTurnstileScript() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  const existing = document.getElementById(SCRIPT_ID);
  if (existing) {
    return new Promise(resolve => {
      if (window.turnstile) resolve();
      else existing.addEventListener('load', () => resolve(), { once: true });
    });
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Turnstile'));
    document.head.appendChild(script);
  });
}

/**
 * Explicit Turnstile widget for Remix forms.
 * Writes token into a hidden input named `cf-turnstile-response`.
 */
export function Turnstile({
  siteKey,
  action = 'contact',
  theme = 'auto',
  onTokenChange,
  className,
}) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  const attemptsRef = useRef(0);
  const [error, setError] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    if (!siteKey || !containerRef.current) return undefined;

    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || !containerRef.current || !window.turnstile) return;
      if (widgetIdRef.current != null) return;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action,
        theme,
        callback: value => {
          setToken(value);
          onTokenChange?.(value);
        },
        'expired-callback': () => {
          setToken('');
          onTokenChange?.('');
        },
        'error-callback': () => {
          setToken('');
          onTokenChange?.('');
          setError(true);
        },
      });
    };

    const tryRender = async () => {
      try {
        await loadTurnstileScript();
        if (cancelled) return;

        if (window.turnstile) {
          renderWidget();
          return;
        }

        if (attemptsRef.current >= MAX_ATTEMPTS) {
          setError(true);
          return;
        }

        attemptsRef.current += 1;
        window.setTimeout(tryRender, 200);
      } catch {
        if (!cancelled) setError(true);
      }
    };

    tryRender();

    return () => {
      cancelled = true;
      if (widgetIdRef.current != null && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // widget already gone
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, action, theme, onTokenChange]);

  function retry() {
    setError(false);
    setToken('');
    onTokenChange?.('');
    attemptsRef.current = 0;
    if (widgetIdRef.current != null && window.turnstile) {
      try {
        window.turnstile.remove(widgetIdRef.current);
      } catch {
        // ignore
      }
      widgetIdRef.current = null;
    }
    // force effect re-run by clearing container and reloading
    if (containerRef.current) containerRef.current.innerHTML = '';
    loadTurnstileScript().then(() => {
      if (containerRef.current && window.turnstile && widgetIdRef.current == null) {
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme,
          callback: value => {
            setToken(value);
            onTokenChange?.(value);
          },
          'expired-callback': () => {
            setToken('');
            onTokenChange?.('');
          },
          'error-callback': () => {
            setToken('');
            onTokenChange?.('');
            setError(true);
          },
        });
      }
    });
  }

  if (!siteKey) {
    return (
      <div className={styles.error} role="alert">
        Turnstile site key is not configured.
      </div>
    );
  }

  return (
    <div className={className}>
      {error ? (
        <div className={styles.error} role="alert">
          Security check failed to load.{' '}
          <button type="button" className={styles.retry} onClick={retry}>
            Try again
          </button>
        </div>
      ) : (
        <div ref={containerRef} className={styles.widget} aria-label="Security verification" />
      )}
      <input type="hidden" name="cf-turnstile-response" value={token} readOnly />
    </div>
  );
}
