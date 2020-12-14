import template from "./Card.hbs"

import BaseComponent from "../BaseComponent.js";
import Button from "../Button/Button";
import {Icons} from "../../modules/consts/icons";
import Image from "../Image/Image";

export default class Card extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
        // TODO: в eventBus при добавлении на доску Events.addPinToBoard
        document.addEventListener('click', this.changeLikeButton.bind(this));
    }

    render() {
        const share = new Button({
            customButton: 'btn_round btn_round_middle btn_with-icon card__actions__go share',
            text: Icons.share,
        })
        const copyLink = new Button({
            customButton: 'btn_round btn_round_middle btn_with-icon card__actions__go copy-link',
            text: Icons.link,
            dataAttr: 'data-copy="true"',
            ext: 'localhost:3000/pin/' + this.context.id,
        })
        const pinCard = new Image({
            class: 'card__img',
            id: 'pin' + this.context.id,
            src: this.context.img_link,
        })
        this.context = {
            ...this.context,
            pinCard: pinCard.render(),
            share: share.render(),
            copyLink: copyLink.render(),
        }
        return super.render();
    }

    changeLikeButton(event) {
        const likeButton = event.target.closest('.card__actions__like');
        if (likeButton) {
            event.preventDefault();
            likeButton.classList.toggle('card__actions__like__active');
        }
    }
}