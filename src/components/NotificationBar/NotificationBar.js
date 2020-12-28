import template from "./NotificationBar.hbs"
import BaseComponent from "../BaseComponent.js";
import Button from "../Button/Button";
import {Icons} from "../../modules/consts/icons";

export default class NotificationBar extends BaseComponent {
    close
    closeTimeout

    constructor(context = {}) {
        super(template, context);
        this.context.id = 'alert';
    }

    render() {
        this.close = new Button({
            id: 'alert-close',
            customButton: 'btn_round btn_round_mini btn_with-icon btn_transparent',
            text: Icons.remove
        })
        this.context = {
            ...this.context,
            close: this.close.render(),
        }
        return super.render();
    }

    setText(text) {
        this.element.querySelector('.alert__text').textContent = text;
    }

    show(note) {
        this.element.classList.add('alert_' + note.type);
        this.element.classList.add('alert_active');
        this.element.querySelector('.alert__text').textContent = note.text;

        this.closeTimeout = setTimeout(() => {
            this.closeBar();
        }, 3000);
    }

    closeBar() {
        clearTimeout(this.closeTimeout);
        this.element.classList.remove('alert_active');
    }
}