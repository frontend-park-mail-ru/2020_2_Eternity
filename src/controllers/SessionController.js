import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import Navbar from "../components/Navbar/Navbar";

import Request from "../modules/request/Request";

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
        this.notification = setInterval(() => {
            Request.getNotifications().then((response) => {
                return response.json();
            }).then((responseJSON) => {
                eventBus.emit(Events.newNotifications, {num: responseJSON.length});
            });
        }, 1000000);

        eventBus.emit(Events.navbarChanged, {isAuth: true, username: data.username});
        eventBus.on(Events.userLogout, this.onLogout.bind(this));
    }

    off() {
        clearInterval(this.notification);
        eventBus.emit(Events.navbarChanged, {isAuth: false});
        eventBus.off(Events.userLogout, this.onLogout.bind(this));
    }

    // TODO: func for check user session

    onLogout(data = {}) {
        data.event.preventDefault();
        UserModel.logout().then((response) => {
            if (!response.error) {
                console.log('logout success')
                eventBus.emit(Events.pathChanged, {path: routes.mainPage});
                this.off();
            }
        }).catch((error) => console.log(error));
    }

    onSearch(data = {}) {
        /*if (data.request.search('@') === 0) {
            let searchString = data.request.split('@')[1];
            eventBus.emit(Events.pathChanged, {path: `/?type=user&content=${searchString}`});
        } else {
            eventBus.emit(Events.pathChanged, {path: `/?type=pin&content=${data.request}`});
        }*/

        eventBus.emit(Events.pathChanged, {path: `/?type=:search&content=${data.request}`});
    }
}

export default new SessionController();