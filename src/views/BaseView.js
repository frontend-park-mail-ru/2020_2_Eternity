import Navbar from "../components/Navbar/Navbar.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import UserModel from "../models/UserModel";

export default class BaseView {
    context
    template
    navbar
    #app

    constructor(title, context = {}, template) {
        document.title = title;
        this.template = template;
        this.context = context;

        this.#app = document.getElementById('app')
        this.navbar = Navbar;
    }

    render() {
        this.context['navbar'] = this.navbar.render();
        this.#app.innerHTML = this.template(this.context);

        // TODO: вынести обработчик наружу и добавить событие обновления шапки отдельно
        if (this.navbar.logoutLink) {
            this.navbar.logoutLink.addEventListener('click', Navbar.logoutClick);
        }
        if (document.getElementById('showNotifs')) {
            document.getElementById('showNotifs').addEventListener('click', (event) => {
                event.preventDefault();
                setTimeout(() => {
                    eventBus.emit(Events.navbarChanged, {num: '3'})
                }, 1000)
            })
        }
    }

    clear() {
        this.#app.innerHTML = '';
    }

    fillWith(...data) {
        data.forEach((obj) => {
            Object.entries(obj).forEach(([key, value]) => {
                this.context[key] = value;
            })
        });
    }

}

