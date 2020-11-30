import template from "./Dialog.hbs"

import BaseComponent from "../BaseComponent.js";
import Avatar from "../Avatar/Avatar";

export default class Dialog extends BaseComponent {
    avatar

     constructor(context = {}) {
        super(template, context);
        this.avatar = new Avatar();
        // TODO: eventBus
    }

    markRead() {
        if (this.element) {
            this.element.closest('.dialog').classList.remove('dialog_unread');
        }
    }
    markUnread() {
        if (this.element) {
            this.element.closest('.dialog').classList.add('dialog_unread');
        }
    }

    updateDialogInfo(data={}) {
        if (this.element) {
            const info = this.element.lastElementChild;
            if (data.time) {
                info.querySelector('.dialog__info__time').innerHTML = data.time;
            }
            if (data.num) {
                info.querySelector('.dialog__info__count').innerHTML = data.num;
            }
        }
    }
}