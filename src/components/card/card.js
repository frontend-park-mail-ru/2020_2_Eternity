import template from "./card.hbs"

import BaseComponent from "../base_component.js";

export default class Card extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}