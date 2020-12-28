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

        this.defaultPage = {
            icon: Icons.home,
            href: '/',
            custom: 'pages-link',
        };
        this.link = new Link({
            id: 'pagesLink',
            custom: 'menu-link ' + this.defaultPage.custom,
            href: this.defaultPage.href,
            text: this.defaultPage.icon,
        })
    }

    render() {
        this.createPagesLink();

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

        if (document.getElementById('navbar')) {
            this.formNoCollapseMenu();
            this.formCollapseMenu();
            this.formDrops();
        }

        if (this.context.isAuth) {
            if (document.getElementById('logout')) {
                document.getElementById('logout').addEventListener('click', this.onLogoutClick);
            }
        }
    }

    createElem(content, id='') {
        const el = document.createElement('li');
        el.className = 'menu-item';
        el.id = id;
        el.innerHTML = content;
        return el;
    }

    createPagesLink() {
        if (window.location.pathname === '/following') {
            this.defaultPage.icon = Icons.heart;
            this.defaultPage.href = '/following';
            this.defaultPage.custom = 'pages-link';
        } else {
            this.defaultPage.icon = Icons.home;
            this.defaultPage.href = '/';
            this.defaultPage.custom = (window.location.pathname === '/') ? 'pages-link' : '';
        }
        this.link.context = {
            ...this.link.context,
            custom: 'menu-link ' + this.defaultPage.custom,
            href: this.defaultPage.href,
            text: this.defaultPage.icon,
        }
        if (this.context.isAuth) {
            this.link.context.text = this.link.context.text + ' ' + Icons.arrowBottom
            this.link.context.dataAttr = 'data-activates="pagesDrop"';
        }
    }

    formNoCollapseMenu() {
        const node = document.createElement('ul');

        this.createPagesLink();
        node.insertAdjacentElement('afterbegin', this.createElem(this.link.render()));
        node.insertAdjacentElement('afterbegin', this.createElem(this.themeSwitcher.render(), 'themeItem'));

        if (this.context.isAuth) {
            node.insertAdjacentElement('afterbegin', this.createElem(this.notificationBell.render()));

            const link = new Link({
                href: '/messages',
                custom: 'navbrand__messages-icon',
                text: Icons.chat,
            })
            node.insertAdjacentElement('afterbegin', this.createElem(link.render(), 'messages'));
        }
        node.insertAdjacentHTML('afterbegin', this.search.render());

        document.getElementById('menu_no-collapse').innerHTML = node.innerHTML;
    }

    formCollapseMenu() {
        const node = document.createElement('ul');

        node.insertAdjacentElement('beforeend', this.createElem(this.themeSwitcher.render(), 'themeItem-collapse'));

        if (this.context.isAuth) {
            const menu = new Link({
                href: `/@${this.context.username}`,
                custom: 'menu-link',
                text: 'Профиль',
            });
            node.insertAdjacentElement('beforeend', this.createElem(menu.render()));

            const ms = new Link({
                href: '/messages',
                custom: 'menu-link',
                text: 'Сообщения',
            })
            node.insertAdjacentElement('beforeend', this.createElem(ms.render(), 'messages-link'));

            const logout = new Link({
                href: '',
                id: 'logout',
                custom: 'menu-link',
                text: 'Выход',
            })
            node.insertAdjacentElement('beforeend', this.createElem(logout.render()));
        } else {
            const signup = new Link({
                href: `/signup`,
                custom: 'menu-link',
                text: 'Регистрация',
            });
            node.insertAdjacentElement('beforeend', this.createElem(signup.render()));

            const login = new Link({
                href: `/login`,
                custom: 'menu-link',
                text: 'Вход',
            });
            node.insertAdjacentElement('beforeend', this.createElem(login.render()));
        }

        document.getElementById('menu').innerHTML = node.innerHTML;
    }

    formDrops() {
        if (!document.getElementById('notificationsDropdown')) {
            document.getElementById('navbar').insertAdjacentHTML('afterend', this.dropdown.render())
        }
        if (!document.getElementById('pagesDrop')) {
            document.getElementById('navbar').insertAdjacentHTML('afterend', this.pagesDrop.render())
        }
        if (!document.getElementById('alert')) {
            document.getElementById('navbar').insertAdjacentHTML('afterend', this.notificationBar.render())
        }
    }
}

export default new Navbar();