import template from "./Card.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Card extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
        // TODO: в eventBus при добавлении на доску Events.addPinToBoard
        document.addEventListener('click', this.changeLikeButton.bind(this));
    }

    changeLikeButton(event) {
        const likeButton = event.target.closest('.card__actions__like');
        if (likeButton) {
            event.preventDefault();
            likeButton.classList.toggle('card__actions__like__active');
        }
    }
}