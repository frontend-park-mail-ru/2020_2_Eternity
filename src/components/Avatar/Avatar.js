import template from "./Avatar.hbs"

import BaseComponent from "../BaseComponent.js";
import Image from "../Image/Image";

export default class Avatar extends BaseComponent {
    imageID

    constructor(context = {}) {
        super(template, context);
        this.imageID = 'avatar' + this.context.id;
    }

    render() {
        const avaImg = new Image({
            src: this.context.img_link,
            class: 'avatar__img',
            id: 'avatar' + this.context.id,
            alt: 'avatar',
        })
        this.context.avaImg = avaImg.render();
        return super.render();
    }

    clear() {
        if (this.context.id) {
            document.getElementById(this.imageID).setAttribute('src',
                this.context.img_link ? this.context.img_link : '/img/default.svg');
        }
    }
    set(imgSrc) {
        if (this.context.id) {
            document.getElementById(this.imageID).setAttribute('src', imgSrc);
        }
    }
}