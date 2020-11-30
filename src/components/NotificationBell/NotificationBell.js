import template from "./NotificationBell.hbs"

import BaseComponent from "../BaseComponent.js";

import EventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";

export default class NotificationBell extends BaseComponent {
    countNews

    constructor(context = {}) {
        super(template, context);
        EventBus.on(Events.newNotifications, this.setNotificationsCount.bind(this))
        EventBus.on(Events.clearNotifications, this.clearNotificationsCount.bind(this))
    }

    setNotificationsCount(data) {
        if (this.element) {
            this.context.num = data.num;
            this.element.querySelector('.notification__count').innerHTML = data.num;
            this.countNews = data.num;
        }
    }
    clearNotificationsCount() {
        if (this.element) {
            this.element.querySelector('.notification__count').innerHTML = '';
            this.countNews = 0;
        }
    }
}