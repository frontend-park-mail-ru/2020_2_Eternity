import template from "./Navbar.hbs"

import BaseComponent from "../BaseComponent.js";
import NotificationBell from "../NotificationBell/NotificationBell";
import Search from "../Search/Search";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import Dropdown from "../Dropdown/Dropdown";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";

class Navbar extends BaseComponent {
    burger
    menu
    notificationBell
    dropdown
    search

    constructor(context = {}) {
        super(template, context);
        this.context.isAuthenticated = false;
        document.addEventListener('click', this.changeMobileMenuViewBind.bind(this));
    }

    render() {
        this.search = new Search({id: 'searchForm', placeholder: 'Введите @пользователя или название пина для поиска'});
        this.themeSwitcher = ThemeSwitcher;
        this.dropdown = new Dropdown({
            id: 'notificationsDropdown',
        })
        this.notificationBell = new NotificationBell({
            id: 'showNotifications',
            dataAttr: 'data-activates="' + this.dropdown.context.id + '"',
        })

        const data = {
            notification: this.notificationBell.render(),
            search: this.search.render(),
            theme: this.themeSwitcher.render(),
            notificationsDropdown: this.dropdown.render(),
        }

        this.context = {...this.context, ...data};
        return super.render();
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
        this.context = { ...data };

        const navbar = document.getElementById('navbar');
        if (navbar) {
            navbar.outerHTML = this.render();
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