import template from "./card.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Card extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }
}