import template from "./message.hbs"

import BaseComponent from "../BaseComponent.js";

export default class Message extends BaseComponent {
     constructor(context = {}) {
        super(template, context);
    }
}