import BaseController from "./BaseController.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import Navbar from "../components/Navbar/Navbar";

class SearchController extends BaseController {
    nav

    constructor() {
        super();
        this.nav = Navbar;
    }

    on() {
        document.addEventListener('click', (event) => {
            if (event.target.closest('#clearSearchBtn')) {
                this.nav.search.clearInput();
            }
        });
    }

    off() {}
}

export default new SearchController();