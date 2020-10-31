import BaseComponent from "../../base_component.js";

export default class ResetIcon extends BaseComponent {
    constructor(context = {}) {
        super('reset.hbs', context);
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