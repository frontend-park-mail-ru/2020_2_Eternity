import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"
import ProfilePage from "../views/Profile/Profile.js";
import SettingsPage from "../views/Settings/Settings.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import Navbar from "../components/Navbar/Navbar";
import PinModel from "../models/PinModel";
import BoardModel from "../models/BoardModel";
import EventBus from "../modules/tools/EventBus";

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

    on(data = {}) {
        eventBus.on(Events.userInfoUpdate, this.onUserInfoUpdate.bind(this));
        eventBus.on(Events.userAvatarUpdate, this.onUserAvatarUpdate.bind(this));
        eventBus.on(Events.userPasswordUpdate, this.onUserPasswordUpdate.bind(this));
        eventBus.on(Events.profileUpdate, this.onUpdateProfile.bind(this));
        this.view.onFollow = this.onFollow.bind(this);
        this.view.onShowFollowers = this.onShowFollowers.bind(this);
        this.view.onShowFollowings = this.onShowFollowings.bind(this);
        this.view.onTabChange = this.onTabChange.bind(this);
        this.view.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.view.onShowNewContent = this.onShowNewContent.bind(this);

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

            if (this.type === 'view') {
                PinModel.getUserPins(data).then((pinsResponse) => {
                    this.view.fillWith({pins: pinsResponse});

                    BoardModel.getUserBoards(data).then((boardsResponse) => {
                        this.view.fillWith({boards: boardsResponse});
                        this.view.render();
                    });
                });
            } else {
                this.view.render();
            }
        }).catch((error) => console.log(error));
        super.on();
    }

    off() {
        this.view.followPopup.close();
        eventBus.off(Events.userInfoUpdate, this.onUserInfoUpdate.bind(this));
        eventBus.off(Events.userAvatarUpdate, this.onUserAvatarUpdate.bind(this));
        eventBus.off(Events.userPasswordUpdate, this.onUserPasswordUpdate.bind(this));
        eventBus.off(Events.profileUpdate, this.onUpdateProfile.bind(this));

        super.off();
    }

    onUserInfoUpdate(data = {}) {
        UserModel.updateProfile(data).then((response) => {
            this.view.fillWith(response);
            console.log('Profile updated: ', response.username);
        }).catch((error) => console.log(error));
    }

    onUserAvatarUpdate(data = {}) {
        UserModel.updateAvatar(data['file']).then((response) => {
            // TODO: обновить аватар в шапке и вообще добавить его туда :D event bus emit
            this.view.context.avatar = URL.createObjectURL(data['localFile']);
            this.view.render();
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

    onFollow(event) {
        event.preventDefault();
        UserModel.followUser({username: this.view.context.username}).then((response) => {
            if (!response.error) {
                console.log(response)
                this.view.changeUserFollowersNum(this.view.context.followers++);
            }
        }).catch((error) => console.log(error));
    }

    onShowFollowers(event) {
        UserModel.getFollowers({username: event.target.getAttribute('href')}).then((r) => {

            this.view.formFollowList(r);
            this.view.followPopup.formContent(this.view.list.render());
        })
        this.showPopup(event)
    }

    onShowFollowings(event) {
        UserModel.getFollowings({username: event.target.getAttribute('href')}).then((r) => {
            this.view.formFollowList(r);
            this.view.followPopup.formContent(this.view.list.render());
        })
        this.showPopup(event)
    }

    showPopup(event) {
        const origin = event.target.closest('[data-popup]');
        if (origin) {
            const targetSelector = origin.getAttribute('data-popup');
            this.view.followPopup.origin = origin;
            this.view.followPopup.clearContent();
            this.view.followPopup.open(targetSelector);
        }
    }

    onTabChange(event) {
        if (event.target instanceof HTMLInputElement) {
            switch(event.target.id.replace('tab', '')) {
                case 'pin':
                    this.view.changeDeskContent(this.view.renderedPins.join('\n'));
                    break;
                case 'board':
                    this.view.changeDeskContent(this.view.renderedBoards.join('\n'));
                    break;
                default:
                    this.view.changeDeskContent([...this.view.renderedPins, ...this.view.renderedBoards].join('\n'));
                    break;
            }
        }
    }
    onAnimationEnd(event) {
        this.view.removeAnimation(event);
    }
    onShowNewContent(event) {
        if (event.animationName === 'fade-out') {
            this.view.deskContent.innerHTML = this.view.content;
            this.view.deskContent.classList.add('fade-in');
        }
    }
}
