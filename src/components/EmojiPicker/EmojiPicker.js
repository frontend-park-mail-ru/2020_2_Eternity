import template from "./EmojiPicker.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Dialog extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
    }


}