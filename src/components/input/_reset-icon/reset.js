import template from "./reset.hbs"

import BaseComponent from "../../BaseComponent.js";

export default class ResetIcon extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    show() {
        this.element.setAttribute('style', 'opacity: 1');
    }

    hide() {
        this.element.setAttribute('style', 'opacity: 0');
    }

    get element() {
        return document.getElementById(this.context.id)
    }
}