import template from "./button-link.hbs"

import BaseComponent from "../../BaseComponent.js";

export default class ButtonLink extends BaseComponent {

    constructor(context = {}) {
        super(template, context);
    }

    changeStyleState(style) {
        document.getElementById(this.context.id).classList.toggle(style);
    }
    changeText(text) {
        document.getElementById(this.context.id).textContent = text;
    }

    bind(style) {
        if (this.element) {
            this.element.addEventListener('click', () => {
                this.changeStyleState(style);
            });
        }
    }
}