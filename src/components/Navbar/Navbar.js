import template from "./Navbar.hbs"

import BaseComponent from "../BaseComponent.js";
import NotificationBell from "../NotificationBell/NotificationBell";
import Search from "../Search/Search";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import Dropdown from "../Dropdown/Dropdown";
import NotificationBar from "../NotificationBar/NotificationBar";
import Link from "../Link/Link";

import eventBus from "../../modules/tools/EventBus.js";
import {Events} from "../../modules/consts/events.js";
import {Icons} from "../../modules/consts/icons";


class Navbar extends BaseComponent {
    burger
    menu
    notificationBell
    dropdown
    search

    link
    pagesDrop

    notificationBar

    constructor(context = {}) {
        super(template, context);
        this.context.isAuth = false;

        this.onLogoutClick = this.logoutClick.bind(this);

        document.addEventListener('click', this.changeMobileMenuViewBind.bind(this));
        document.addEventListener('click', this.showPages.bind(this));

        this.themeSwitcher = ThemeSwitcher;
        this.dropdown = new Dropdown({
            id: 'notificationsDropdown',
            placeholder: 'Новых уведомлений нет',
        })
        this.notificationBell = new NotificationBell({
            id: 'showNotifications',
            dataAttr: 'data-activates="' + this.dropdown.context.id + '"',
        })
        this.notificationBar = new NotificationBar();
        this.search = new Search({
            id: 'searchForm',
            placeholder: 'Введите @Имя пользователя или #Пин для поиска только в этих категориях'
        });
    }

    render() {
        let defaultPage = {
            icon: Icons.home,
            href: '/',
            custom: 'pages-link',
        };
        if (window.location.pathname === '/following') {
            defaultPage.icon = Icons.heart;
            defaultPage.href = '/following';
        }
        this.link = new Link({
            id: 'pagesLink',
            custom: 'menu-link ' + defaultPage.custom,
            href: defaultPage.href,
            text: defaultPage.icon,
        })
        if (this.context.isAuth) {
            this.link.context.text = this.link.context.text + ' ' + Icons.arrowBottom
            this.link.context.dataAttr = 'data-activates="pagesDrop"';
        }

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
            search: this.search.render(),
            theme: this.themeSwitcher.render(),
            l: this.link.render(),
        }
        const authData = {
            notification: this.notificationBell.render(),
            notificationsDropdown: this.dropdown.render(),
            notificationBar: this.notificationBar.render(),
            pagesDrop: this.pagesDrop.render(),
        }

        this.context.isAuth ? this.context = {...this.context, ...data, ...authData} : this.context = {...this.context, ...data};
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
    logoutClick(event) {
        document.getElementById('logout').removeEventListener('click', this.onLogoutClick);
        eventBus.emit(Events.userLogout, {event: event});
    }

    change(data={}) {
        this.context = {...this.context, ...data};
        if (this.context.isAuth) {
            if (document.getElementById('logout')) {
                document.getElementById('logout').addEventListener('click', this.onLogoutClick);
            }
        }
    }

    formNoCollapseMenu() {
        const node = document.createElement('ul');

        const el = document.createElement('li');
        el.className = 'menu-item';

        el.innerHTML = this.link.render();
        node.insertAdjacentElement('afterbegin', el);

        el.id = 'themeItem';
        el.innerHTML = this.themeSwitcher.render();
        node.insertAdjacentElement('afterbegin', el);

        if (this.context.isAuth) {
            el.id = '';
            el.innerHTML = this.notificationBell.render();
            node.insertAdjacentElement('afterbegin', el);

            el.id = 'messages';
            const link = new Link({
                href: '/messages',
                custom: 'navbrand__messages-icon',
                text: Icons.chat,
            })
            el.innerHTML = link.render();
            node.insertAdjacentElement('afterbegin', el);
        }
        node.insertAdjacentHTML('afterbegin', this.search.render());

        document.getElementById('menu_no-collapse').innerHTML = node.innerHTML;
    }

    formCollapseMenu() {
        const node = document.createElement('ul');

        const el = document.createElement('li');
        el.className = 'menu-item';

        el.id = 'themeItem-collapse';
        el.innerHTML = this.themeSwitcher.render();
        node.insertAdjacentElement('beforeend', el);

        el.id = '';
        if (this.context.isAuth) {
            el.innerHTML = new Link({
                href: `/@${this.context.username}`,
                custom: 'menu-link',
                text: 'Профиль',
            }).render();
            node.insertAdjacentElement('beforeend', el);

            el.id = 'messages-link';
            el.innerHTML = new Link({
                href: '/messages',
                custom: 'menu-link',
                text: 'Сообщения',
            })
            node.insertAdjacentElement('beforeend', el);

            el.id = '';
            el.innerHTML = new Link({
                href: '',
                id: 'logout',
                custom: 'menu-link',
                text: 'Выход',
            })
            node.insertAdjacentElement('beforeend', el);
        } else {
            el.innerHTML = new Link({
                href: `/signup`,
                custom: 'menu-link',
                text: 'Регистрация',
            }).render();
            node.insertAdjacentElement('beforeend', el);

            el.innerHTML = new Link({
                href: `/login`,
                custom: 'menu-link',
                text: 'Вход',
            }).render();
            node.insertAdjacentElement('beforeend', el);
        }

        document.getElementById('menu').innerHTML = node.innerHTML;
    }
}

export default new Navbar();