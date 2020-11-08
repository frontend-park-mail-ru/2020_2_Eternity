import template from "./textarea.hbs"

import BaseComponent from "../../BaseComponent.js";

export default class Textarea extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    get value() {
        return document.getElementById(this.context.id).value;
    }

    clear() {
        this.element.value = '';
    }
}
