import template from "./chat-message.hbs"

import BaseComponent from "../../BaseComponent.js";

export default class ChatMessage extends BaseComponent {
     constructor(context = {}) {
        super(template, context);
    }
}