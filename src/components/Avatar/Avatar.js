import template from "./Avatar.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Avatar extends BaseComponent {
    imageID

    constructor(context = {}) {
        super(template, context);
        this.imageID = 'avatar' + this.context.id;
    }

    clear() {
        if (this.context.id) {
            document.getElementById(this.imageID).setAttribute('src', '/img/default.svg');
        }
    }
    set(imgSrc) {
        if (this.context.id) {
            document.getElementById(this.imageID).setAttribute('src', imgSrc);
        }
    }
}