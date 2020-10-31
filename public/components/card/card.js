import BaseComponent from "../base_component.js";

export default class Card extends BaseComponent {
    constructor(context = {}) {
        super('card.hbs', context);
    }
}