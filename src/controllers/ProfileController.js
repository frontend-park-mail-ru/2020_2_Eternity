import BaseController from "./base_controller.js";

import UserModel from "../models/UserModel.js"
import ProfilePage from "../views/profile/profile.js";
import SettingsPage from "../views/settings/settings.js";

import eventBus from "../modules/tools/eventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";


export default class ProfileController extends BaseController {
    constructor(type) {
        if (type === 'view') {
            super(new ProfilePage());
        }
        if (type === 'edit') {
            super(new SettingsPage());
        }

        eventBus.on(Events.userInfoUpdate, this.onUserInfoUpdate.bind(this));
        eventBus.on(Events.userAvatarUpdate, this.onUserAvatarUpdate.bind(this));
        // eventBus.on(Events.userPasswordUpdate, this.onUserPasswordUpdate.bind(this));
        eventBus.on(Events.profileUpdate, this.onUpdateProfile.bind(this));
    }

    on(data={}) {
        let userInfo = {};
        UserModel.getProfile().then((response) => {
            this.view.fillWith(response);
            this.view.render();
        }).catch((error) => console.log(error));
        super.on();
    }

    onUserInfoUpdate(data={}) {
        UserModel.updateProfile(data).then((response) => {
            console.log('info update')
        }).catch((error) => console.log(error));
    }

    onUserAvatarUpdate(data={}) {
        UserModel.updateAvatar(data).then((response) => {
            // TODO: обновить аватар в шапке и вообще добавить его туда :D event bus emit
            console.log('avatar update')
        }).catch((error) => console.log(error));
    }

    // TODO: onUserPasswordUpdate

    onUpdateProfile(data={}) {
        data.event.preventDefault();
        if (data.file) {
            eventBus.emit(Events.userAvatarUpdate, data.file);
        }
        eventBus.emit(Events.userInfoUpdate, data);
    }
}