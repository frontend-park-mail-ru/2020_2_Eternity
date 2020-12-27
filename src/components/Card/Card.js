import template from "./Card.hbs"

import BaseComponent from "../BaseComponent.js";
import Button from "../Button/Button";
import {Icons} from "../../modules/consts/icons";
import Image from "../Image/Image";

export default class Card extends BaseComponent {
    profile;

    constructor(context = {}, profile = false) {
        super(template, context);
        this.profile = profile;
    }

    render() {
        this.profile ? this.context.height = 15 * parseFloat(getComputedStyle(document.documentElement).fontSize) :
                       this.context.height = this.context.height /
                           (this.context.width / (15 * parseFloat(getComputedStyle(document.documentElement).fontSize)));
        this.context.width = 15 * parseFloat(getComputedStyle(document.documentElement).fontSize);

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
            id: 'imgpin' + this.context.id,
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
}