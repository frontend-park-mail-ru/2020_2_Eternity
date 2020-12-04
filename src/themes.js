const STORAGE_KEY = 'user-color-scheme';

const applyTheme = (passedSetting) => {
    let currentSetting = passedSetting || localStorage.getItem(STORAGE_KEY);
    if (currentSetting) {
        document.documentElement.dataset.theme = currentSetting;
    }
};

const toggleTheme = () => {
    let currentTheme = localStorage.getItem(STORAGE_KEY);
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    localStorage.setItem(STORAGE_KEY, currentTheme);
    return currentTheme;
};

getCurrentTheme = () => {
    return localStorage.getItem(STORAGE_KEY) || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

applyTheme();

onThemeChanged = () => {
    applyTheme(toggleTheme());
}