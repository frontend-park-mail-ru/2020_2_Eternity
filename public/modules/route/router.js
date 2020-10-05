export default class Router {
    root
    routes

    constructor(root) {
        this.root = root;
        this.routes = {};
    }

    bind(path, callback) {
        this.routes[path] = callback
        return this;
    }

    start() {
        this.root.addEventListener('click', (evt) => {
            const {target} = evt;

            if (target instanceof HTMLAnchorElement) {
                evt.preventDefault();
                this.open(target.pathname);
            }
        });

        window.addEventListener('popstate', () => {
            const currentPath = window.location.pathname;
            this.open(currentPath);
        });

        this.open(window.location.pathname);
    }

    open(path) {
        // TODO: нормальное предупреждение о 404
        const route = this.routes[path]

        if (route === undefined) {
            return this.routes['/'].call()
        }

        return route.call();
    }

    // TODO: HISTORY API
}