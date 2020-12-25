import BaseController from "./BaseController.js";
import UserModel from "../models/UserModel";
import Navbar from "../components/Navbar/Navbar";

import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import ws from "../modules/websocket/websocket";
import Span from "../components/Span/Span";


class NotificationsController extends BaseController {
    nav

    constructor() {
        super();
        this.nav = Navbar;

        this.onSetNewNotificationsHandle = this.onSetNewNotifications.bind(this);
        this.onClearNotificationsHandle = this.onClearNotifications.bind(this);
        this.onAddNotificationHandle = this.onAddNotification.bind(this);
        this.onDecNotificationHandle = this.onDecNotification.bind(this);
        this.onShowNotificationBar = this.onShowNotificationBar.bind(this);
    }

    onSetNewNotifications(data={}) {
        this.nav.notificationBell.setNotificationsCount(data);
    }
    onClearNotifications(data={}) {
        this.nav.notificationBell.clearNotificationsCount(data);
    }
    onAddNotification(data={}) {
        this.nav.notificationBell.addNotification(data);
    }
    onDecNotification(data={}) {
        this.nav.notificationBell.decNotification(data);
    }

    onShowNotificationBar(data={}) {
        this.nav.notificationBar.show(data);
    }

    on() {
        // this.nav.onShowNotifications = this.onShowNotifications.bind(this);
        document.addEventListener('click', (event) => {
            const bell = event.target.closest('#' + this.nav.notificationBell.context.id);
            if (bell) {
                this.onShowNotifications(event);
            }
        })
        document.addEventListener('click', (event) => {
            const close = event.target.closest('#alert-close');
            if (close) {
                this.nav.notificationBar.closeBar();
            }
        })

        EventBus.on(Events.newNotifications, this.onSetNewNotificationsHandle);
        EventBus.on(Events.clearNotifications, this.onClearNotificationsHandle);
        EventBus.on(Events.addNotification, this.onAddNotificationHandle);
        EventBus.on(Events.showNotificationBar, this.onShowNotificationBar);
    }

    off() {
        EventBus.off(Events.newNotifications, this.onSetNewNotificationsHandle);
        EventBus.off(Events.clearNotifications, this.onClearNotificationsHandle);
        EventBus.off(Events.addNotification, this.onAddNotificationHandle);
        EventBus.off(Events.showNotificationBar, this.onShowNotificationBar);
    }

    onShowNotifications(event) {
        const origin = event.target.closest('[data-activates]');
        if (origin) {
            const targetSelector = origin.getAttribute('data-activates');
            this.nav.dropdown.origin = origin;
            this.nav.dropdown.dropdown = document.getElementById(targetSelector);

            if (this.nav.dropdown.isOpened) {
                this.nav.dropdown.hide()
            } else {
                UserModel.getNotifications().then((r) => {
                    let res = [];
                    r.forEach((n) => {
                        const s = new Span({text: ws.parseNotification(n), custom: 'notification__item'})
                        res.push(s);
                    })
                    this.nav.dropdown.list.formContentFromListObjects(res)
                    this.nav.dropdown.show();
                })
            }
        }
    }
}

export default new NotificationsController();