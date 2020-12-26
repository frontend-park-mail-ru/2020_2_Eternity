import template from "./ThemeSwitcher.hbs"

import BaseComponent from "../BaseComponent.js";
import "../../themes"

class ThemeSwitcher extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
        this.context.id = 'themeSwitcher';
        this.init();
    }

    init() {
        document.addEventListener('change', (event) => {
            if (event.target instanceof HTMLElement && event.target.closest('#themeSwitcher')) {
                // eslint-disable-next-line no-undef
                onThemeChanged();
            }
        });
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', this.toggleThemeSwitcher.bind(this));
        // eslint-disable-next-line no-undef
        if (getCurrentTheme() === 'dark') {
            this.setChecked();
        }
    }

    toggleThemeSwitcher() {
        (window.matchMedia('(prefers-color-scheme: dark)').matches) ? applyTheme('dark') : applyTheme('light');
        // eslint-disable-next-line no-undef
        if (getCurrentTheme() === 'dark') {
            this.setChecked();
        } else {
            this.element.checked = false;
            this.context.dark = false;
        }
    }

    render() {
        // eslint-disable-next-line no-undef
        this.context.dark = getCurrentTheme() === 'dark';
        return super.render();
    }

    get value() {
        return this.element.checked;
    }
    setChecked() {
        this.context.dark = true;
        if (this.element) {
            this.element.checked = true;
        }
    }
}

export default new ThemeSwitcher();