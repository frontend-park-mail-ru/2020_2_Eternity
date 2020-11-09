import template from "./notifications.hbs"

import BaseComponent from "../BaseComponent.js";

export default class NotificationBell extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
        this.context.notificationsNum = 0;
        this.context.options = [];
        this.context.options.push(125);
    }

    bind() {
        console.log(document.getElementById('showNotifications'))
        document.getElementById('showNotifications').addEventListener('click', (event) => {
            document.getElementById('notificationList').classList.toggle('no-display');
        })
    }
}