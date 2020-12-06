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
        this.countNews = data.num;
        this.context.num = data.num;
        if (this.element) {
            if (this.countNews >= 100) {
                this.element.querySelector('.notification__count').classList.add('notification__count_too-much');
            }
            this.element.querySelector('.notification__count').innerHTML = data.num;
        }
    }
    clearNotificationsCount() {
        this.countNews = 0;
        this.context.num = 0;
        if (this.element) {
            this.element.querySelector('.notification__count').innerHTML = '';
        }
    }

    // TODO: inc, dec
}