import template from "./img.hbs"

import BaseComponent from "../../base_component.js";

export default class Image extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

    set() {
        Object.entries(this.context).forEach(([attr, value]) => {
            this.element.setAttribute(attr, value);
        });
    }

    show(target) {
        this.context.src = target;
        this.context.style = 'opacity: 1';
        this.set();
    }

    clear() {
        this.context.src = '';
        this.context.style = 'opacity: 0';
        this.set();
    }

    get element() {
        return document.getElementById(this.context.id);
    }
}