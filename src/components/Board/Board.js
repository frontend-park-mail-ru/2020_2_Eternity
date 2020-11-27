import template from "./Board.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Board extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}