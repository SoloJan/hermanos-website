/**
 * i18n.js — Lightweight translation system
 *
 * Usage in HTML:  <span data-i18n="nav.product"></span>
 * Usage for attrs: <img data-i18n-alt="hero.image_alt">
 *
 * Language is stored in localStorage and can also be set via ?lang=nl in the URL.
 */

const I18n = (() => {
  const STORAGE_KEY = 'he_lang';
  const SUPPORTED = ['en', 'nl'];
  const DEFAULT_LANG = 'en';

  let currentLang = DEFAULT_LANG;
  let translations = {};

  /** Resolve language: URL param → localStorage → browser → default */
  function detectLang() {
    const urlParam = new URLSearchParams(window.location.search).get('lang');
    if (urlParam && SUPPORTED.includes(urlParam)) return urlParam;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored)) return stored;

    const browser = navigator.language?.slice(0, 2);
    if (browser && SUPPORTED.includes(browser)) return browser;

    return DEFAULT_LANG;
  }

  /** Fetch and apply a language */
  async function setLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;

    try {
      const base = window.__BASE__ || '';
      const response = await fetch(`${base}locales/${lang}.json`);
      if (!response.ok) throw new Error(`Could not load ${lang}.json`);
      translations = await response.json();
      currentLang = lang;
      localStorage.setItem(STORAGE_KEY, lang);
      applyTranslations();
      updateLangButtons();
      document.documentElement.setAttribute('lang', lang);
    } catch (err) {
      console.warn('[i18n]', err.message);
      if (lang !== DEFAULT_LANG) setLang(DEFAULT_LANG);
    }
  }

  /** Resolve a dot-notation key from the translations object */
  function t(key) {
    return key.split('.').reduce((obj, part) => obj?.[part], translations) ?? key;
  }

  /** Replace all data-i18n and data-i18n-* attributes in the DOM */
  function applyTranslations() {
    // Text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });

    // HTML content (for rich text with links etc.)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      el.innerHTML = t(key);
    });

    // Attributes (alt, placeholder, aria-label, title, etc.)
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      // Format: "attrName:key.path"
      const pairs = el.getAttribute('data-i18n-attr').split(',');
      pairs.forEach(pair => {
        const [attr, key] = pair.trim().split(':');
        if (attr && key) el.setAttribute(attr, t(key));
      });
    });
  }

  /** Sync the EN/NL toggle buttons in the header */
  function updateLangButtons() {
    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-lang-btn') === currentLang);
    });
  }

  /** Public API */
  return {
    init() {
      const lang = detectLang();
      setLang(lang);
    },
    switch(lang) {
      setLang(lang);
    },
    t,
    get current() { return currentLang; }
  };
})();

// Auto-init on DOM ready
document.addEventListener('DOMContentLoaded', () => I18n.init());
