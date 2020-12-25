import template from "./Boardbar.hbs"

import BaseComponent from "../BaseComponent.js";
import Button from "../Button/Button";
import {Icons} from "../../modules/consts/icons";

export default class Boardbar extends BaseComponent {
    btn

    constructor(context = {}) {
        super(template, context);
    }

    render() {
        this.btn = new Button({
            customButton: 'btn_green btn_round btn_with-icon btn_round_middle',
            text: this.context.type === 'add' ? Icons.add : Icons.remove,
        })
        this.context.active = this.context.type !== 'add';

        this.context.btn = this.btn.render();
        return super.render();
    }

    changeButtonToAdd() {
        this.element.querySelector('.boardbar__btn').classList.remove('boardbar__btn_active');
        this.btn.element.textContent = Icons.add;
    }

    changeButtonToRemove() {
        this.element.querySelector('.boardbar__btn').classList.add('boardbar__btn_active');
        this.btn.element.innerHTML = Icons.remove;
    }
}