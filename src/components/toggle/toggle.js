import template from "./toggle.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Toggle extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    get element() {
        return document.getElementById(this.context.id);
    }
    get value() {
        return document.getElementById(this.context.id).checked;
    }
}
