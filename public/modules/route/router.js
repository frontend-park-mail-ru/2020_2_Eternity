import eventBus from "../tools/eventBus.js";
import {Events} from "../consts/events.js";
import {routes} from "../consts/routes.js";

export default class Router {
    container

    root
    mode
    routes

    current
    currentController
    state

    /**
     * @constructor
     *
     * @param container - корневой html-элемент приложения, куда будут рендерится страницы
     * @param {object} options - Настройки роутера
     */
    constructor(container, options = {}) {
        let settings = {};
        const defaults = {
            root: '/',
            routes: [],
            mode: 'history',
        };

        Object.keys(defaults).forEach((key) => {
            settings[key] = options[key] || defaults[key];
        })

        this.container = container;
        this.state = null;
        this.root = settings.root;
        this.mode = settings.mode;

        this.routes = [];
        if (settings.routes && settings.routes.length > 0) {
            settings.routes.forEach((route) => {
                this.add(route.path, route.controller);
            })
        }

        eventBus.on(Events.pathChanged, this.go.bind(this));
    }

    /**
     * @ignore
     * Убирает / в начале и в конце path
     *
     * @param {string} path
     * @returns {string}
     */
    // TODO: все-таки очистка слэшей нужна, потому что идет два совпадения: / и /:path, плохо
    clearSlashes(path) {
        if (typeof path !== 'string') {
            return '';
        }
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }


    /**
     * Конвертирует path в выражение для consts/routes
     *
     * @param {string} path
     * @returns {string}
     */
    parseRule(path) {
        if (typeof path !== 'string') {
            return routes.mainPage;
        }

        return path.replace(/\d+/, ':num');
    }

    /**
     * Парсит строку запроса и возвращает параметры запроса в виде объекта
     *
     * @param {string} queryString - path+query
     * @returns {Object}
     */
    parseQuery(queryString) {
        let query = {}
        if (typeof queryString !== 'string') {
            return query;
        }

        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')

        pairs.forEach((pair) => {
            const parts = pair.split('=');
            if (parts[0] !== '') {
                query[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1] || '');
            }
        })

        return query;
    }

    /**
     * Выделяет URI относительно root (без параметров)
     *
     * @returns {string}
     */
    getFragment() {
        let fragment = decodeURI(window.location.pathname);

        if (this.root !== '/') {
            fragment = fragment.replace(this.root, '');
        }
        return fragment;
    }

    /**
     * Связывает path с обработчиком и добавляет в routes
     *
     * @param {string} path
     * @param {*} controller
     * @returns {Router}
     */
    add(path, controller) {
        this.routes.push({
            path: path,
            controller: controller,
        })
        return this;
    }

    /**
     * Удалить пару {path: controller} из routes
     *
     * @param {string} path
     * @returns {Router}
     */
    remove(path) {
        for (let i = 0; i < this.routes.length; i++) {
            if (this.routes[i].path === path) {
                this.routes.splice(i, 1);
                return this;
            }
        }
        return this;
    }

    /**
     * Сбросить routes
     *
     * @returns {Router}
     */
    flush() {
        this.routes = [];
        return this;
    }

    /**
     * Возвращает HTMLAnchorElement, для которого необходимо перейти по ссылке (пин, ссылка)
     *
     * @param target
     * @returns {HTMLAnchorElement}
     */
    checkAnchor(target) {
        if (target instanceof HTMLAnchorElement) {
            return target;
        }
        if (target instanceof HTMLImageElement && target.parentElement instanceof HTMLAnchorElement) {
            return target.parentElement;
        }
        return target;
    }

    /**
     * Запуск роутера на прослушивание событий изменения URI
     */
    start() {
        this.container.addEventListener('click', (evt) => {
            let {target} = evt;
            target = this.checkAnchor(target);

            if (target instanceof HTMLAnchorElement) {
                evt.preventDefault();
                this.navigateTo(target.pathname, this.state);
            } else {
                evt.preventDefault();
            }
        });

        window.addEventListener('popstate', () => {
            this.check();
        });


        this.check();
    }

    /**
     * Добавление страницы в historyAPI и ее отображение
     * если она отлична от текущей
     *
     * @param path
     * @param state
     * @returns {*}
     */
    navigateTo(path = '', state = null) {
        if (path === this.getFragment()) {
            return;
        }
        // TODO: обновление контента страницы по запросу
        window.history.pushState(state, '', this.root + this.clearSlashes(path));
        this.check();
        return this;
    }

    /**
     * Проверка, есть ли обработчик для текущего path и его вызов
     *
     * @returns {boolean}
     */
    check() {
        const fragment = this.getFragment();

        return this.routes.some(route => {
            const match = this.parseRule(fragment).match(route.path);

            if (match) {
                match.shift();
                this.state = null;

                this.current = fragment;
                this.currentController = route.controller;
                route.controller.on();
            }

            return false;
        });
    }

    /**
     * Симуляция кнопки браузера Назад
     * @returns {Router}
     */
    back() {
        window.history.back();
        return this;
    }

    /**
     * Симуляция кнопки браузера Вперед
     * @returns {Router}
     */
    forward() {
        window.history.forward();
        return this;
    }

    /**
     * Сохранение текущей страницы при обновлении
     * @returns {this}
     */
    refresh() {
       const path = this.getFragment();
       return this.navigateTo(path, this.state);
    }

    go(data={}) {
        this.navigateTo(data.path);
    }
}