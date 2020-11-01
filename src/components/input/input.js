import template from "./input.hbs"

import BaseComponent from "../base_component.js";
import Error from "../error/error.js";

export default class Input extends BaseComponent {
    err

    constructor(context = {}) {
        super(template, context);
    }

    createErrorElement() {
        const elem = document.createElement('template');
        elem.innerHTML = this.err.render().trim();

        return elem.content.firstChild;
    }

    addError(errMessage) {
        this.err = new Error({
            errMessage: errMessage,
        });

        this.element.after(this.createErrorElement());
    }

    resetError() {
        this.element.parentNode.querySelector('.error').remove();
    }

    get element() {
        return document.getElementById(this.context.id);
    }

    get error() {
        return this.err;
    }
}
