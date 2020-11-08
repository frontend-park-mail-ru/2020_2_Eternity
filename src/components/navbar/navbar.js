import template from "./navbar.hbs"

import BaseComponent from "../BaseComponent.js";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";


class Navbar extends BaseComponent {
    constructor(context = {}) {
        super(template, context);
        this.context.isAuthenticated = false;
    }

    get logoutLink() {
        return document.getElementById('logout');
    }

/*
    static change = (navbar, data={}) => {
        console.log('data:', data)
        console.log('context before:', navbar.context)
        navbar.context = data;
        console.log(navbar);
        console.log('context after:', navbar.context)
    }
*/

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