import template from "./Navbar.hbs"

import BaseComponent from "../BaseComponent.js";
import NotificationBell from "../NotificationBell/NotificationBell";
import Search from "../Search/Search";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import Dropdown from "../Dropdown/Dropdown";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import Link from "../Link/Link";
import {Icons} from "../../modules/consts/icons";

class Navbar extends BaseComponent {
    burger
    menu
    notificationBell
    dropdown
    search

    link
    pagesDrop

    constructor(context = {}) {
        super(template, context);
        this.context.isAuthenticated = false;
        document.addEventListener('click', this.changeMobileMenuViewBind.bind(this));
        document.addEventListener('click', this.showPages.bind(this));
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

        let defaultPage = {
            icon: Icons.home,
            href: '/',
            custom: ''
        };
        switch (document.title.trim().split(' ').pop()) {
            case 'Главная':
                defaultPage.custom = 'pages-link';
                break;
            case 'Подписки':
                defaultPage = {
                    icon: Icons.heart,
                    href: '/following',
                    custom: 'pages-link',
                }
                break;
        }

        this.link = new Link({
            id: 'pagesLink',
            custom: 'menu-link ' + defaultPage.custom,
            href: defaultPage.href,
            text: defaultPage.icon + ' ' + Icons.arrowBottom,
            dataAttr: 'data-activates="pagesDrop"'
        })
        const mainLink = new Link({
            href: '/',
            text: 'Главная',
            custom: 'create__link'
        })
        const subFeedLink = new Link({
            href: '/following',
            text: 'Подписки',
            custom: 'create__link'
        })
        this.pagesDrop = new Dropdown({
            id: 'pagesDrop',
        })
        this.pagesDrop.formContent([mainLink, subFeedLink]);

        const data = {
            notification: this.notificationBell.render(),
            search: this.search.render(),
            theme: this.themeSwitcher.render(),
            notificationsDropdown: this.dropdown.render(),

            l: this.link.render(),
            pagesDrop: this.pagesDrop.render(),
        }

        this.context = {...this.context, ...data};
        return super.render();
    }

    showPages(event) {
        const origin = event.target.closest('[data-activates]');
        if (origin && origin.getAttribute('id') === this.link.context.id) {
            const targetSelector = origin.getAttribute('data-activates');
            this.pagesDrop.origin = origin;
            this.pagesDrop.dropdown = document.getElementById(targetSelector);
            this.pagesDrop.isOpened ? this.pagesDrop.hide() : this.pagesDrop.show();
        }
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