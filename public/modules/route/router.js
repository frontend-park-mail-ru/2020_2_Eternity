export default class Router {
    container

    root
    mode
    routes

    current
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
                this.bind(route.path, route.handler);
            })
        }
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
     * Выделяет URI относительно root
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
     * @param {function} callback
     * @returns {Router}
     */
    bind(path, callback) {
        this.routes.push({
            path: path,
            handler: callback,
        })
        return this;
    }

    /**
     * Удалить пару {path: обработчик} из routes
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
     * Запуск роутера на прослушивание событий изменения URI
     */
    start() {
        this.container.addEventListener('click', (evt) => {
            const {target} = evt;

            if (target instanceof HTMLAnchorElement) {
                evt.preventDefault();
                this.navigateTo(target.pathname, this.state);
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
        let fragment = this.getFragment();

        return this.routes.some(route => {
            const match = fragment.match(route.path);

            if (match) {
                match.shift();
                this.current = fragment;
                this.state = null;
                route.handler.apply(this, match);
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
       return this.navigateTo(path, this.state)
    }
}