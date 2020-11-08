import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import Navbar from "../components/navbar/navbar.js";

class SessionController extends BaseController {
    constructor() {
        super();

        eventBus.on(Events.navbarChanged, Navbar.change.bind(Navbar));

        UserModel.getProfile().then((response) => {
            if (!response.error) {
                this.on(response);
            }
        });
    }

    on(data={}) {
        eventBus.emit(Events.navbarChanged, {isAuth: true, username: data.username});
        eventBus.on(Events.userLogout, this.onLogout.bind(this));
    }

    off() {
        eventBus.emit(Events.navbarChanged, {isAuth: false});
        eventBus.off(Events.userLogout, this.onLogout.bind(this));
    }

    // TODO: func for check user session

    onLogout(data={}) {
        data.event.preventDefault();
        UserModel.logout().then((response) => {
            if (!response.error) {
                console.log('logout success')
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
                this.off();
            }
        }).catch((error) => console.log(error));
    }
}

export default new SessionController();