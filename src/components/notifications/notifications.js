import template from "./notifications.hbs"

import BaseComponent from "../BaseComponent.js";

export default class NotificationBell extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
        this.context.notificationsNum = 0;
    }
}