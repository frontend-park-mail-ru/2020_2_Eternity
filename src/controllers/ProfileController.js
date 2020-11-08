import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"
import ProfilePage from "../views/profile/profile.js";
import SettingsPage from "../views/settings/settings.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import Navbar from "../components/navbar/navbar.js";

export default class ProfileController extends BaseController {
    type;

    constructor(type) {
        if (type === 'view') {
            super(new ProfilePage());
        }
        if (type === 'edit') {
            super(new SettingsPage());
        }
        this.type = type;
    }

    on(data={}) {
        eventBus.on(Events.userInfoUpdate, this.onUserInfoUpdate.bind(this));
        eventBus.on(Events.userAvatarUpdate, this.onUserAvatarUpdate.bind(this));
        eventBus.on(Events.userPasswordUpdate, this.onUserPasswordUpdate.bind(this));
        eventBus.on(Events.profileUpdate, this.onUpdateProfile.bind(this));

         (this.type === 'view' ? UserModel.getUserProfile(data) : UserModel.getProfile()).then((response) => {
            if (Navbar.context.isAuth) {
                if (Navbar.context.username === response.username) {
                    response.edit = true;
                    response.show = false;
                } else {
                    response.edit = false;
                    response.show = true;
                }
            } else {
                response.edit = false;
                response.show = false;
            }

            if (!response.avatar) {
                response.avatar = '/img/default.svg'
            }
            this.view.fillWith(response);
            this.view.render();
        }).catch((error) => console.log(error));
        super.on();
    }

    off() {
        eventBus.off(Events.userInfoUpdate, this.onUserInfoUpdate.bind(this));
        eventBus.off(Events.userAvatarUpdate, this.onUserAvatarUpdate.bind(this));
        eventBus.off(Events.userPasswordUpdate, this.onUserPasswordUpdate.bind(this));
        eventBus.off(Events.profileUpdate, this.onUpdateProfile.bind(this));

        super.off();
    }

    onUserInfoUpdate(data={}) {
        UserModel.updateProfile(data).then((response) => {
            this.view.fillWith(response);
            console.log('profile updated: ', response.username);
        }).catch((error) => console.log(error));
    }

    onUserAvatarUpdate(data={}) {
        UserModel.updateAvatar(data['file']).then((response) => {
            // TODO: обновить аватар в шапке и вообще добавить его туда :D event bus emit
            this.view.context.avatar = URL.createObjectURL(data['localFile']);
            this.view.render();
        }).catch((error) => console.log(error));
    }

    onUserPasswordUpdate(data={}) {
        UserModel.updatePassword(data).then((response) => {
            console.log('password updated: ', response.username);
        }).catch((error) => console.log(error));
    }

    onUpdateProfile(data={}) {
        data.event.preventDefault();
        if (data['file']) {
            eventBus.emit(Events.userAvatarUpdate, data);
        }

        if (data['oldPassword'] && data['newPassword']) {
            eventBus.emit(Events.userPasswordUpdate, {oldpassword: data.oldPassword, newpassword: data.newPassword});
            console.log(data.oldPassword, data.newPassword);
        }
        // TODO: добавить eventBus.emit(Events.userPasswordUpdate, {oldpassword: data.oldpassword, newpassword: data.newpassword})
        eventBus.emit(Events.userInfoUpdate, data);
    }
}