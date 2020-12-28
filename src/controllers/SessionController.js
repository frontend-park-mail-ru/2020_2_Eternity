import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import Navbar from "../components/Navbar/Navbar";


class SessionController extends BaseController {
    notification

    constructor() {
        super();

        eventBus.on(Events.navbarChanged, Navbar.change.bind(Navbar));
        eventBus.on(Events.search, this.onSearch.bind(this));

        UserModel.getProfile().then((response) => {
            if (!response.error) {
                this.on(response);
            }
        });
    }

    on(data = {}) {
        eventBus.emit(Events.navbarChanged, {isAuth: true, username: data.username});
        eventBus.on(Events.userLogout, this.onLogout.bind(this));
    }

    off() {
        clearInterval(this.notification);
        eventBus.emit(Events.navbarChanged, {isAuth: false});
        eventBus.off(Events.userLogout, this.onLogout.bind(this));
    }

    onLogout(data = {}) {
        data.event.preventDefault();
        UserModel.logout().then((response) => {
            if (!response.error) {
                this.off();
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
            }
        }).catch((error) => console.log(error));
    }

    onSearch(data = {}) {
        if (data.request.search('@') === 0) {
            let searchString = data.request.split('@')[1];
            eventBus.emit(Events.pathChanged, {path: `/?type=user&content=${searchString}`});
        } else if (data.request.search('#') === 0) {
            let searchString = data.request.split('#')[1];
            eventBus.emit(Events.pathChanged, {path: `/?type=pin&content=${searchString}`});
        } else {
            eventBus.emit(Events.pathChanged, {path: `/?type=:search&content=${data.request}`});
        }

        // eventBus.emit(Events.pathChanged, {path: `/?type=:search&content=${data.request}`});
    }
}

export default new SessionController();