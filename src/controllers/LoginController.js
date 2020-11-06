import BaseController from "./base_controller.js";

import UserModel from "../models/UserModel.js"
import AuthRegPage from "../views/auth/auth.js";

import eventBus from "../modules/tools/eventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

export default class LoginController extends BaseController {
    constructor(type) {
        super(new AuthRegPage(type));
    }

    on() {
        eventBus.on(Events.userLogin, this.onLogin.bind(this));
        eventBus.on(Events.userLogout, this.onLogout.bind(this));
        eventBus.on(Events.userSignup, this.onSignup.bind(this));

        super.on();
    }

    off() {
        eventBus.off(Events.userLogin, this.onLogin.bind(this));
        eventBus.off(Events.userLogout, this.onLogout.bind(this));
        eventBus.off(Events.userSignup, this.onSignup.bind(this));

        super.off();
    }

    onLogin(data={}) {
        UserModel.login(data).then((response) => {
            if (!response.error) {
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
            }
        }).catch((error) => console.log(error));
    }

    onLogout(data={}) {
        data.event.preventDefault();
        UserModel.logout().then((response) => {
            if (response.ok) {
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
                //todo: тут обновить шапку с флагом неавторизации eventBus.emit()
            }
        }).catch((error) => console.log(error));
    }

    onSignup(data={}) {
        UserModel.reg(data).then((response) => {
            if (!response.error) {
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
            }
        }).catch((error) => console.log(error));
    }
}