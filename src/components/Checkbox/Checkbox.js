import template from "./Checkbox.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Checkbox extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    isChecked() {
        if (this.element) {
            return this.element.checked;
        }
    }
    get text() {
        if (this.element) {
            return this.element.parentElement.nextElementSibling.textContent;
        }
    }
    setChecked() {
        if (this.element) {
            this.element.checked = true;
        }
    }
    clean() {
        if (this.element) {
            this.element.checked = false;
        }
    }
}