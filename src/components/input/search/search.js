import template from "./search.hbs"

import BaseComponent from "../../BaseComponent.js";

export default class Search extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }

}