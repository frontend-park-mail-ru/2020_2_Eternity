import BaseController from "./BaseController.js";
import UserModel from "../models/UserModel";
import Navbar from "../components/Navbar/Navbar";

import eventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import ws from "../modules/websocket/websocket";

class NotificationsController extends BaseController {
    nav

    constructor() {
        super();
        this.nav = Navbar;
    }

    on() {
        // this.nav.onShowNotifications = this.onShowNotifications.bind(this);
        document.addEventListener('click', (event) => {
            const bell = event.target.closest('#' + this.nav.notificationBell.context.id);
            if (bell) {
                this.onShowNotifications(event);
            }
        })
    }

    off() {}

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
                    r.forEach((note) => {
                        const data = ws.parseNotification(note);
                        res.push(data)
                    })
                    this.nav.dropdown.show();
                })
            }
        }
    }
}

export default new NotificationsController();