import template from "./Followbar.hbs"

import BaseComponent from "../BaseComponent.js";
import Button from "../Button/Button";
import {Icons} from "../../modules/consts/icons";
import Avatar from "../Avatar/Avatar";

export default class Followbar extends BaseComponent {
    avatar

    constructor(context = {}) {
        super(template, context);

        this.avatar = new Avatar({
            img_link: this.context.avatar ? this.context.avatar : '/img/default.svg',
            custom: 'avatar_middle'
        })
        this.context.followers = context.followers ? context.followers : 0;
    }

    render() {
        this.context = {
            ...this.context,
            avatar: this.avatar.render(),
        }
        return super.render();
    }
}