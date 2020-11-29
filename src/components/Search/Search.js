import template from "./Search.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Search extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}