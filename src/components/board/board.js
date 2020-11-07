import template from "./board.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Board extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}