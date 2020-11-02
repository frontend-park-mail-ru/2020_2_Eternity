import BaseController from "./base_controller.js";

import UserModel from "../models/UserModel.js"
import AuthRegPage from "../views/auth/auth.js";

import eventBus from "../modules/tools/eventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

export default class LoginController extends BaseController {
    constructor() {
        super(new AuthRegPage('auth'));

        eventBus.on(Events.userLogin, this.onLogin.bind(this));
        eventBus.on(Events.userLogout, this.onLogout.bind(this));
    }

    on() {
        this.view.render();
    }

    off() {
        this.view.clear();
    }

    onLogin(data={}) {
        UserModel.login(data).then((response) => {
            if (!response.error) {
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
            }
        })
    }

    onLogout(data={}) {
        UserModel.logout().then((response) => {
            if (response.ok) {
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
                //todo: тут обновить шапку с флагом неавторизации eventBus.emit()
            }
        })
    }
}