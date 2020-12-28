import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"
import SettingsPage from "../views/Settings/Settings.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import EventBus from "../modules/tools/EventBus.js";

export default class SettingsController extends BaseController {
    constructor() {
        super(new SettingsPage());

        this.view.onShowAvatarPreview = this.onShowAvatarPreview.bind(this);
        this.view.onResetPreview = this.onResetPreview.bind(this);
    }

    on(data = {}) {
        eventBus.on(Events.userInfoUpdate, this.onUserInfoUpdate.bind(this));
        eventBus.on(Events.userAvatarUpdate, this.onUserAvatarUpdate.bind(this));
        eventBus.on(Events.userPasswordUpdate, this.onUserPasswordUpdate.bind(this));
        eventBus.on(Events.profileUpdate, this.onUpdateProfile.bind(this));

        UserModel.getProfile().then((response) => {
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

        this.view.upload.element.removeEventListener('change', this.view.onShowAvatarPreview);
        this.view.reset.element.removeEventListener('click', this.view.onResetPreview);

        super.off();
    }

    onUserInfoUpdate(data = {}) {
        UserModel.updateProfile(data).then((response) => {
            if (!response.error) {
                this.view.fillWith(response);
                console.log('Profile updated: ', response.username);
                EventBus.emit(Events.showNotificationBar, {type: 'success', text: 'Профиль успешно обновлен'})
            }
        }).catch((error) => console.log(error));
    }

    onUserAvatarUpdate(data = {}) {
        UserModel.updateAvatar(data['file']).then((response) => {
            // TODO: обновить аватар в шапке и вообще добавить его туда :D event bus emit
            this.view.context.avatar = URL.createObjectURL(data['localFile']);
            this.view.render();
            EventBus.emit(Events.showNotificationBar, {type: 'success', text: 'Профиль успешно обновлен'})
        }).catch((error) => console.log(error));
    }

    onUserPasswordUpdate(data = {}) {
        UserModel.updatePassword(data).then((response) => {
            console.log('password updated: ', response.username);
        }).catch((error) => console.log(error));
    }

    onUpdateProfile(data = {}) {
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

    onResetPreview() {
        this.view.reset.hide();
        this.view.avatar.clear();
        this.view.upload.clear();
    }

    onShowAvatarPreview() {
        const reader = new FileReader();
        reader.onload = (evt) => {
            this.view.avatar.set(evt.target.result);
            this.view.reset.show();
        };
        const file = this.view.upload.value;
        if (file && file.type.match('image.*')) {
            reader.readAsDataURL(file);
        }
    }
}