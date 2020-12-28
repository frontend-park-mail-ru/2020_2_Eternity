import template from "./Board.hbs"

import BaseComponent from "../BaseComponent.js";
import Image from "../Image/Image";
import {Icons} from "../../modules/consts/icons";
import Link from "../Link/Link";
import Span from "../Span/Span";

export default class Board extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
        this.context.coverPins = [];
    }

    loadCover(covers = []) {
        if (covers.length !== 0) {
            this.context.coverPins = [];
            covers.forEach((pin) => {
                const cover = new Image({
                    class: 'board__card__img',
                    src: pin.img_link,
                })
                this.context.coverPins.push(cover.render());

                if (document.getElementById('desk-content')) {
                    const board = document.getElementById('desk-content').querySelector(`[data-board="${this.context.id}"]`)
                        .querySelector('.board__card');
                    board.insertAdjacentHTML('beforeend', cover.render());
                }
            })
        } else {
            if (document.getElementById('desk-content')) {
                const board = document.getElementById('desk-content').querySelector(`[data-board="${this.context.id}"]`)
                    .querySelector('.board__card');
                let placeholder = document.createElement('div');
                placeholder.className = 'board__card__placeholder';
                placeholder.innerHTML = Icons.idea;
                placeholder.insertAdjacentText('beforeend', 'Найдите идеи для этой доски');
                board.insertAdjacentElement('afterbegin', placeholder);
                this.context.coverPins.push(placeholder.outerHTML);
            }
        }
    }
}