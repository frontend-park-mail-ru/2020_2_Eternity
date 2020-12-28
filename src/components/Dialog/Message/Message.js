import template from "./Message.hbs"

import BaseComponent from "../../BaseComponent.js";

export default class Message extends BaseComponent {
     constructor(context = {}) {
        super(template, context);
    }
}