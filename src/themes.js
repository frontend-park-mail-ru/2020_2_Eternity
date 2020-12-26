const STORAGE_KEY = 'user-color-scheme';
const mediaPrefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');

// eslint-disable-next-line no-undef
applyTheme = (passedSetting) => {
    // eslint-disable-next-line no-undef
    let currentSetting = passedSetting || getCurrentTheme();
    if (currentSetting) {
        document.documentElement.dataset.theme = currentSetting;
        localStorage.setItem(STORAGE_KEY, currentSetting);
    }
};

// eslint-disable-next-line no-undef
toggleTheme = () => {
    // eslint-disable-next-line no-undef
    let currentTheme = getCurrentTheme();
    currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, currentTheme);
    return currentTheme;
};

// eslint-disable-next-line no-undef
getCurrentTheme = () => {
    return localStorage.getItem(STORAGE_KEY) || (mediaPrefersColorScheme.matches ? 'dark' : 'light');
}

// eslint-disable-next-line no-undef
applyTheme();

// eslint-disable-next-line no-undef
onThemeChanged = () => {
    // eslint-disable-next-line no-undef
    applyTheme(toggleTheme());
}