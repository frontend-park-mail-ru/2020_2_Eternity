import BaseController from "./BaseController.js";
import UserModel from "../models/UserModel";
import Navbar from "../components/Navbar/Navbar";

import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import ws from "../modules/websocket/websocket";
import Notebar from "../components/Notebar/Notebar";
import Link from "../components/Link/Link";
import {Icons} from "../modules/consts/icons";
import Request from "../modules/request/Request";
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
        this.onMarkAllRead = this.markAllRead.bind(this);
    }

    onSetNewNotifications(data={}) {
        this.nav.notificationBell.setNotificationsCount(data);
    }
    onClearNotifications(data={}) {
        this.nav.notificationBell.clearNotificationsCount(data);
    }
    onAddNotification(data={}) {
        if (Object.keys(data).length !== 0) {
            if (this.nav.notificationBell.countNews !== 0) {
                this.nav.dropdown.list.addItem(this.createNote(data));
            } else {
                this.nav.dropdown.list.formContentFromListObjects([this.createMarkRead(), this.createNote(data)]);
                document.getElementById('markAsReadNotes').addEventListener('click', this.onMarkAllRead)
            }
        }
        this.nav.notificationBell.addNotification(data);
    }
    onDecNotification(data={}) {
        this.nav.notificationBell.decNotification(data);
    }

    onShowNotificationBar(data={}) {
        this.nav.notificationBar.show(data);
    }

    on() {
        document.addEventListener('click', (event) => {
            if (event.target.closest('#' + this.nav.notificationBell.context.id)) {
                this.onShowNotifications(event);
            }
        })
        document.addEventListener('click', (event) => {
            if (event.target.closest('#alert-close')) {
                this.nav.notificationBar.closeBar();
            }
        })

        EventBus.on(Events.newNotifications, this.onSetNewNotificationsHandle);
        EventBus.on(Events.clearNotifications, this.onClearNotificationsHandle);
        EventBus.on(Events.addNotification, this.onAddNotificationHandle);
        EventBus.on(Events.showNotificationBar, this.onShowNotificationBar);
    }

    off() {
        if (this.nav.dropdown.isOpened) {
            this.nav.dropdown.hide();
        }
        if (document.getElementById('markAsReadNotes')) {
            document.getElementById('markAsReadNotes').removeEventListener('click', this.onMarkAllRead);
        }
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
                this.nav.dropdown.hide();
            } else {
                UserModel.getNotifications().then((r) => {
                    let res = [];
                    r.forEach((n) => {
                        if (!n.is_read) {
                            const note = ws.parseNotification(n)
                            const bar = this.createNote(note);
                            res.push(bar);
                        }
                    })
                    if (res.length !== 0) {
                        this.nav.dropdown.list.formContentFromListObjects([this.createMarkRead(), ...res])
                        document.getElementById('markAsReadNotes').addEventListener('click', this.onMarkAllRead)
                    }
                    this.nav.dropdown.show();
                })
            }
        }
    }

    markAllRead() {
        Request.markReadNotifications().then(r => {});
        this.onClearNotifications();
        document.getElementById('markAsReadNotes').removeEventListener('click', this.onMarkAllRead);
        this.nav.dropdown.list.formContentFromListObjects([new Span({text: 'Новых уведомлений нет'})]);
    }

    createNote(data={}) {
        return new Notebar({
            id: data.id,
            text: data.text,
            // time: data.getHours() + ':' + data.getMinutes(),
            href: data.href,
            dataAttr: data.chatId ? `data-chat="${data.chatId}"` : '',
        })
    }

    createMarkRead() {
        return new Link({
            dataAttr: 'data-activates=""',
            text: 'Пометить все как прочитанное',
            id: 'markAsReadNotes',
        });
    }
}

export default new NotificationsController();