import template from "./LabeledToggle.hbs";

import BaseComponent from "../../BaseComponent.js";
import Toggle from "../Toggle.js";

export default class LabeledToggle extends BaseComponent {
    toggle

    constructor(context = {}) {
        super(template, context);
    }

    render() {
        this.toggle = new Toggle({
            id: this.context.id,
        });

        this.context = {
            ...this.context,
            toggle: this.toggle.render(),
        }
        return super.render();
    }

    get value() {
        return this.toggle.value;
    }
}