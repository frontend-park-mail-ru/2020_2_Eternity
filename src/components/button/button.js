import template from "./button.hbs"

import BaseComponent from "../base_component.js";

export default class Button extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}