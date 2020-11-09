import template from "./textarea.hbs"

import BaseComponent from "../../BaseComponent.js";

export default class Textarea extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    get element() {
        return document.getElementById(this.context.id);
    }

    get value() {
        return this.element.value;
    }

    clear() {
        this.element.value = '';
    }
}
