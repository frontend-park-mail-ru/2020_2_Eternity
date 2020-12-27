import Navbar from "../components/Navbar/Navbar.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import UserModel from "../models/UserModel";

export default class BaseView {
    title
    context
    template
    navbar
    #app

    constructor(title, context = {}, template) {
        this.title = title;
        this.template = template;
        this.context = context;
        this.notificationLock = true;

        this.#app = document.getElementById('app')
        this.navbar = Navbar;
        this.searchOnEnter = this.searchOnEnter.bind(this);
    }

    render() {
        document.title = 'Pinteo • ' + this.title;

        this.context['navbar'] = this.navbar.render();
        this.#app.innerHTML = this.template(this.context);

        document.addEventListener('keydown', this.searchOnEnter);

        // TODO: вынести обработчик наружу и добавить событие обновления шапки отдельно
        if (this.navbar.logoutLink) {
            this.navbar.logoutLink.addEventListener('click', Navbar.logoutClick);
        }

        if (document.getElementById('search')) {
            document.getElementById('search').addEventListener('click', (event) => {
                event.preventDefault();

                if (this.navbar.search.value) {
                    eventBus.emit(Events.search, {request: this.navbar.search.value});
                }
            });
        }
    }

    change() {
    }

    searchOnEnter(event) {
        if (event.key === 'Enter' && document.activeElement === document.querySelector('.search__input')) {
            event.preventDefault();
            if (this.navbar.search.value) {
                eventBus.emit(Events.search, {request: this.navbar.search.value});
            }
        }
    }

    clear() {
        document.removeEventListener('keydown', this.searchOnEnter);

        this.context = {};
    }

    fillWith(...data) {
        data.forEach((obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                this.context[key] = value;
            })
        });
    }

}

