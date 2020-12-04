import template from "./Navbar.hbs"

import BaseComponent from "../BaseComponent.js";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import NotificationBell from "../NotificationBell/NotificationBell";
import Search from "../Search/Search";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";


class Navbar extends BaseComponent {
    burger
    menu
    notificationBell
    search

    constructor(context = {}) {
        super(template, context);
        this.context.isAuthenticated = false;
        this.notificationBell = new NotificationBell({id: 'showNotifications'})
        this.search = new Search({id: 'searchForm', placeholder: 'Введите @пользователя или название пина для поиска'});
        this.themeSwitcher = ThemeSwitcher;

        this.context.notification = this.notificationBell.render();
        this.context.search = this.search.render();
        this.context.theme = this.themeSwitcher.render();

        document.addEventListener('click', this.changeMobileMenuViewBind.bind(this));
    }

    checkBurgerToggleClick(event) {
        if (event.target.closest('#burger')) {
            this.burger = event.target.closest('#burger');
            this.menu = document.getElementById('menu');
            return true;
        }
        return false;
    }

    changeMobileMenuViewBind(event) {
        if (this.checkBurgerToggleClick(event)) {
            this.menu.classList.toggle('active');
            this.burger.classList.toggle('active');
        }
    }

    get logoutLink() {
        return document.getElementById('logout');
    }

    change (data={}) {
        this.context = {
            ...this.context,
            ...data
        };

        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.innerHTML = this.render();
        }

        if (this.logoutLink) {
            this.logoutLink.addEventListener('click', this.logoutClick);
        }
    }

    logoutClick = (event) => {
        eventBus.emit(Events.userLogout, {event: event});
    }
}

export default new Navbar();