import template from "./Toggle.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Toggle extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
    get value() {
        return this.element.checked;
    }
}
