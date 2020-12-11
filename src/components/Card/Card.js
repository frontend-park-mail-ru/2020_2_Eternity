import template from "./Card.hbs"

import BaseComponent from "../BaseComponent.js";
import Button from "../Button/Button";
import {Icons} from "../../modules/consts/icons";

export default class Card extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
        // TODO: в eventBus при добавлении на доску Events.addPinToBoard
        document.addEventListener('click', this.changeLikeButton.bind(this));
    }

    render() {
        const viewGo = new Button({
            customButton: 'btn_round btn_round_middle btn_with-icon card__actions__go',
            text: Icons.expand,
            dataAttr: 'data-link="/pin/' + this.context.id + '"',
        })
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
        this.context = {
            ...this.context,
            viewGo: viewGo.render(),
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