const STORAGE_KEY = 'user-color-scheme';
const mediaPrefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)');

applyTheme = (passedSetting) => {
    let currentSetting = passedSetting || getCurrentTheme();
    if (currentSetting) {
        document.documentElement.dataset.theme = currentSetting;
        localStorage.setItem(STORAGE_KEY, currentSetting);
    }
};

toggleTheme = () => {
    let currentTheme = getCurrentTheme();
    currentTheme = (currentTheme === 'light') ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, currentTheme);
    return currentTheme;
};

getCurrentTheme = () => {
    return localStorage.getItem(STORAGE_KEY) || (mediaPrefersColorScheme.matches ? 'dark' : 'light');
}

applyTheme();

onThemeChanged = () => {
    applyTheme(toggleTheme());
}