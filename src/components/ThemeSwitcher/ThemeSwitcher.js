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
        if (getCurrentTheme() === 'dark') {
            this.setChecked();
        }
        document.addEventListener('change', (event) => {
            if (event.target instanceof HTMLElement && event.target.closest('#themeSwitcher')) {
                onThemeChanged();
            }
        });
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