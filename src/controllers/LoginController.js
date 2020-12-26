import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"
import AuthRegPage from "../views/Auth/Auth.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import SessionController from "./SessionController";

export default class LoginController extends BaseController {
    constructor(type) {
        super(new AuthRegPage(type));
    }

    on() {
        eventBus.on(Events.userLogin, this.onLogin.bind(this));
        eventBus.on(Events.userSignup, this.onSignup.bind(this));

        super.on();
    }

    off() {
        eventBus.off(Events.userLogin, this.onLogin.bind(this));
        eventBus.off(Events.userSignup, this.onSignup.bind(this));

        super.off();
    }

    onLogin(data={}) {
        UserModel.login(data).then((response) => {
            if (!response.error) {
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
                SessionController.on(response);
                eventBus.emit(Events.onLogin);
            }
        }).catch((error) => console.log(error));
    }

    onSignup(data={}) {
        UserModel.reg(data).then((response) => {
            if (!response.error) {
                this.onLogin(data);
            }
        }).catch((error) => console.log(error));
    }
}