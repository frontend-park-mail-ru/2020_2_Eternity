import template from "./Link.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Link extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}