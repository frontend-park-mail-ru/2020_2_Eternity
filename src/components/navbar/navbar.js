import template from "./navbar.hbs"

import BaseComponent from "../BaseComponent.js";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import ButtonLink from "../button/_button-link/button-link";

import NotificationBell from "../../components/notifications/notifications.js";

class Navbar extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
        this.context.isAuthenticated = false;
        this.context.num = 0;
    }

    get logoutLink() {
        return document.getElementById('logout');
    }

    change (data={}) {
        this.context = data;

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