import template from "./avatar.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Avatar extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}