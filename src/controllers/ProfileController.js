import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"
import ProfilePage from "../views/Profile/Profile.js";

import Navbar from "../components/Navbar/Navbar";
import PinModel from "../models/PinModel";
import BoardModel from "../models/BoardModel";
import EventBus from "../modules/tools/EventBus.js";

export default class ProfileController extends BaseController {
    constructor() {
        super(new ProfilePage());
    }

    on(data = {}) {
        this.view.onFollow = this.onFollow.bind(this);
        this.view.onShowFollowers = this.onShowFollowers.bind(this);
        this.view.onShowFollowings = this.onShowFollowings.bind(this);
        this.view.onTabChange = this.onTabChange.bind(this);
        this.view.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.view.onShowNewContent = this.onShowNewContent.bind(this);

        UserModel.getUserProfile(data).then((response) => {
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

            PinModel.getUserPins(data).then((pinsResponse) => {
                this.view.fillWith({pins: pinsResponse});

                BoardModel.getUserBoards(data).then((boardsResponse) => {
                    this.view.fillWith({boards: boardsResponse});
                    this.view.render();
                });
            });
        }).catch((error) => console.log(error));
        super.on();
    }

    off() {
        this.view.followPopup.close();
        if (this.view.follow) {
            this.view.follow.removeEventListener('click', this.view.onFollow);
        }
        this.view.followers.removeEventListener('click', this.view.onShowFollowers);
        this.view.followings.removeEventListener('click', this.view.onShowFollowings);
        this.view.tabs.removeEventListener('change', this.view.onTabChange);
        this.view.deskContent.removeEventListener('animationend', this.view.onAnimationEnd);
        this.view.deskContent.removeEventListener('animationend', this.view.onShowNewContent);

        super.off();
    }

    onFollow(event) {
        event.preventDefault();
        UserModel.followUser({username: this.view.context.username}).then((response) => {
            if (response.ok) {
                this.view.changeUserFollowersNum(++this.view.context.followers);
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
            switch (event.target.id.replace('tab', '')) {
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
