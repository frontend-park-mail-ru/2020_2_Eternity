import template from "./button.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Button extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}