import template from "./error.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Error extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}