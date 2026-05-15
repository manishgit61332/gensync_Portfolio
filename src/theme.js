const THEME_KEY = 'gensync-theme';
const DEFAULT_THEME = 'dark';

const getStoredTheme = () => {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
};

const storeTheme = (theme) => {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    /* Theme still works for this page load if storage is unavailable. */
  }
};

const setTheme = (theme) => {
  const selectedTheme = theme === 'light' ? 'light' : DEFAULT_THEME;
  document.documentElement.dataset.theme = selectedTheme;
  document.documentElement.style.colorScheme = selectedTheme;

  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme) {
    metaTheme.setAttribute('content', selectedTheme === 'light' ? '#F7F2E8' : '#06060A');
  }

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    const isLight = selectedTheme === 'light';
    button.setAttribute('aria-pressed', String(isLight));
    button.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  });
};

const popToggle = (button) => {
  button.classList.remove('theme-toggle--pop');
  void button.offsetWidth;
  button.classList.add('theme-toggle--pop');
};

const initThemeControls = () => {
  setTheme(getStoredTheme() || document.documentElement.dataset.theme || DEFAULT_THEME);

  document.querySelectorAll('[data-theme-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      const nextTheme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
      setTheme(nextTheme);
      storeTheme(nextTheme);
      popToggle(button);
    });
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initThemeControls, { once: true });
} else {
  initThemeControls();
}
