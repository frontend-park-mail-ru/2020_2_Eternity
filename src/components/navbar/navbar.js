import template from "./navbar.hbs"

import BaseComponent from "../BaseComponent.js";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import NotificationBell from "../NotificationBell/NotificationBell";


class Navbar extends BaseComponent {
    notificationBell

    constructor(context = {}) {
        super(template, context);
        this.context.isAuthenticated = false;
        this.notificationBell = new NotificationBell({id: 'showNotifications'})
    }

    get logoutLink() {
        return document.getElementById('logout');
    }

    change (data={}) {
        this.context = data;
        this.context.notification = this.notificationBell.render();

        let navbar = document.getElementById('navbar');
        navbar.innerHTML = this.render();

        if (this.logoutLink) {
            this.logoutLink.addEventListener('click', this.logoutClick);
        }
    }

    logoutClick = (event) => {
        eventBus.emit(Events.userLogout, {event: event});
    }
}

export default new Navbar();