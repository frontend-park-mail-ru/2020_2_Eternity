import template from "./avatar.hbs"

import BaseComponent from "../base_component.js";

export default class Avatar extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}