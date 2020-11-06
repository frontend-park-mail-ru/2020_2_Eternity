import template from "./board.hbs"

import BaseComponent from "../base_component.js";

export default class Board extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}