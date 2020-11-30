import template from "./Userbar.hbs"

import BaseComponent from "../BaseComponent.js";
import Avatar from "../Avatar/Avatar";

export default class Userbar extends BaseComponent {
    avatar

    constructor(context = {}) {
        super(template, context);

        this.avatar = new Avatar({
            img_link: context.avatar ? context.avatar : '/img/default.svg',
            middle: true
        });
    }

    render() {
        this.context.avatar = this.avatar.render();
        return super.render();
    }
}