import Navbar from "../components/navbar/navbar.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";

export default class BaseView {
    context
    template
    navbar
    #app

    constructor(title, context = {}, template) {
        this.navbar = new Navbar();

        document.title = title;
        this.template = template;
        this.context = context;
        this.context['navbar'] = this.navbar.render();

        this.#app = document.getElementById('app')
    }

    render() {
        this.#app.innerHTML = this.template(this.context)

        // TODO: вынести обработчик наружу и добавить событие обновления шапки отдельно
        this.navbar.logoutLink.addEventListener('click', (event) => {
            eventBus.emit(Events.userLogout, {event: event});
        });
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
