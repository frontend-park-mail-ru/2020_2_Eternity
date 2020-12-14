import template from "./Image.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Image extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    show(target) {
        if (this.element) {
            this.element.src = target;
            this.element.style.opacity = '1';
            this.element.classList.remove('hidden');
        }
    }
    clear() {
        if (this.element) {
            this.element.src = '';
            this.element.style.opacity = '0';
            this.element.classList.add('hidden');
        }
    }
}