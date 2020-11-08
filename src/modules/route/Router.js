import eventBus from "../tools/EventBus.js";
import {Events} from "../consts/events.js";
import {routes} from "../consts/routes.js";

export default class Router {
    container

    root
    mode
    routes

    currentLocation
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
     * Парсит строку запроса (window.location.search) и возвращает параметры запроса в виде объекта
     *
     * @param {string} queryString - path+query
     * @returns {Object}
     */
    parseQuery(queryString) {
        let query = {}
        if (typeof queryString !== 'string') {
            return query;
        }

        const params = new URLSearchParams(queryString);
        params.forEach((value, key) => {
            query[key] = value;
        })

        return query;
    }

    /**
     * Парсит пути вида path/:id и возвращает объект {path: id} (как в parseQuery)
     * ! :id может быть :num (pin) или :word (username) !
     *
     * @param path
     * @returns {{}}
     */
    parsePathWithId(path) {
        let param = {};
        if (typeof path !== 'string') {
            return param;
        }
        if (path.match(routes.pinPage)) {
            const parts = path.split('/');
            param[parts[0]] = parts[1];
            return param;
        }
    }

    /**
     * Возвращает объект query с параметрами для запроса
     *
     * @param {string} fragment - Текущий путь для проверки в parsePathWithId
     * @returns {{}}
     */
    getQuerySet(fragment) {
        const id = this.parsePathWithId(this.clearSlashes(fragment));
        const search = this.parseQuery(window.location.search);

        return {...id, ...search}
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
     * @param {RegExp | string} path
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
    checkRouteAnchor(target) {
        if (target instanceof HTMLAnchorElement) {
            return target;
        }
        if (target && target.parentElement instanceof HTMLAnchorElement) {
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
            target = this.checkRouteAnchor(target);

            if (target instanceof HTMLAnchorElement) {
                evt.preventDefault();
                this.navigateTo(target.pathname, this.state);
            }
            // TODO: если этого else не будет, то будет плохо при переходе по пинам с главной :)
            //       если ткнуть по сердечку или card-content блоку попасть, например
            //       но без этого не будут работать кнопки ugh
            // else {
            //     evt.preventDefault();
            // }
        });

        window.addEventListener('popstate', () => {
            this.checkRoute();
        });

        this.checkRoute();
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
        // TODO: обновление контента страницы по запросу на эту же страницу?
        if (path === this.getFragment()) {
            return;
        }
        window.history.pushState(state, '', this.root + this.clearSlashes(path));
        this.checkRoute();
        return this;
    }

    /**
     * Проверка, есть ли обработчик для текущего path и его вызов
     *
     * @returns {boolean}
     */
    checkRoute() {
        const fragment = this.getFragment();

        return this.routes.some(route => {
            //const match = this.parseRule(fragment).match(route.path);
            const match = fragment.match(route.path);
            const query = this.getQuerySet(fragment);

            if (match) {
                match.shift();
                if (this.currentController) {
                    this.currentController.off();
                }

                this.currentLocation = fragment;
                this.currentController = route.controller;
                route.controller.on(query);
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
        if (!this.currentLocation) {
            return this;
        }
        const path = this.getFragment();
        return this.navigateTo(path, this.state);
    }

    /**
     * Callback на Events.pathChanged
     * @param data
     */
    go(data={}) {
        this.navigateTo(data.path);
    }
}