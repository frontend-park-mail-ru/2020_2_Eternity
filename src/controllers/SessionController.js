import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

class SessionController extends BaseController {
    constructor() {
        super();
        eventBus.on(Events.userLogout, this.onLogout.bind(this));
    }

    off() {
        eventBus.off(Events.userLogout, this.onLogout.bind(this));
        super.off();
    }

    // TODO: func for check user session

    onLogout(data={}) {
        data.event.preventDefault();
        UserModel.logout().then((response) => {
            if (!response.error) {
                console.log('logout success')
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
                //todo: тут обновить шапку с флагом неавторизации eventBus.emit()
            }
        }).catch((error) => console.log(error));
    }
}

export default new SessionController();