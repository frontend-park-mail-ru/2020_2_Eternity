import BaseController from "./BaseController.js";

import UserModel from "../models/UserModel.js"
import ProfilePage from "../views/Profile/Profile.js";

import Navbar from "../components/Navbar/Navbar";
import PinModel from "../models/PinModel";
import BoardModel from "../models/BoardModel";
import EventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events";
import ChatModel from "../models/ChatModel";
import Span from "../components/Span/Span";

export default class ProfileController extends BaseController {
    constructor() {
        super(new ProfilePage());

        // follow btn and follows lists
        this.view.onFollow = this.onFollow.bind(this);
        this.view.onUnfollow = this.onUnfollow.bind(this);
        this.view.onShowFollowers = this.onShowFollowers.bind(this);
        this.view.onShowFollowings = this.onShowFollowings.bind(this);
        // message btn
        this.view.onCreateChat = this.onCreateChat.bind(this);
        // tabs
        this.view.onTabChange = this.onTabChange.bind(this);
        this.view.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.view.onShowNewContent = this.onShowNewContent.bind(this);
    }

    on(data = {}) {
        UserModel.getUserProfile(data).then((response) => {
            if (Navbar.context.isAuth) {
                if (Navbar.context.username === response.username) {
                    response.edit = true;
                    response.show = false;
                } else {
                    response.edit = false;
                    response.show = true;

                    UserModel.isFollowing({username: response.username}).then((r) => {
                        if (r.following) {
                            this.swapFollowListeners();
                        }
                    })
                }
            } else {
                response.edit = false;
                response.show = false;
            }

            if (!response.avatar) {
                response.avatar = '/img/default.svg'
            }

            this.view.fillWith(response);
            this.view.load(response);

            PinModel.getUserPins(data).then((pinsResponse) => {
                this.view.fillWith({pins: pinsResponse});

                BoardModel.getUserBoards(data).then((boardsResponse) => {
                    this.view.fillWith({boards: boardsResponse});
                    this.view.loadDesk();
                });
            });
        }).catch((error) => console.log(error));
        super.on();
    }

    off() {
        this.view.followPopup.close();
        if (this.view.follow) {
            this.view.follow.removeEventListener('click', this.view.onFollow);
            this.view.follow.removeEventListener('click', this.view.onUnfollow);
        }
        if (this.view.btnMessage) {
            this.view.btnMessage.removeEventListener('click', this.view.onCreateChat);
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
                this.swapFollowListeners();
            }
        }).catch((error) => console.log(error));
    }
    onUnfollow(event) {
        event.preventDefault();
        UserModel.unfollowUser({username: this.view.context.username}).then((response) => {
            if (response.ok) {
                this.view.changeUserFollowersNum(--this.view.context.followers);
                this.swapFollowListeners();
            }
        })
    }
    swapFollowListeners() {
        if (this.view.btnSub.stateNum === 0 && this.view.follow) {
            this.view.follow.removeEventListener('click', this.view.onFollow);
            this.view.follow.addEventListener('click', this.view.onUnfollow);
        } else {
            this.view.follow.removeEventListener('click', this.view.onUnfollow);
            this.view.follow.addEventListener('click', this.view.onFollow);
        }
        this.view.btnSub.changeBtnStateSequentially();
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
        let help = new Span({custom: 'profile__info__help'})

        if (event.target instanceof HTMLInputElement) {
            switch (event.target.id.replace('tab', '')) {
                case 'pin':
                    if (this.view.pins.length !== 0) {
                        this.view.changeDeskContent(this.view.pins);
                    } else {
                        help.context.text = 'Пользователь еще не создал ни одного пина';
                        document.getElementById('desk-content').innerHTML = help.render()
                    }
                    break;
                case 'board':
                    if (this.view.boards.length !== 0) {
                        this.view.changeDeskContent(this.view.boards);
                    } else {
                        help.context.text = 'Пользователь еще не создал ни одной доски';
                        document.getElementById('desk-content').innerHTML = help.render()
                    }
                    break;
                default:
                    if (this.view.boards.length === 0 && this.view.pins.length === 0) {
                        help.context.text = 'У пользователя нет досок или пинов';
                        document.getElementById('desk-content').innerHTML = help.render()
                    } else  {
                        this.view.changeDeskContent([...this.view.pins, ...this.view.boards]);
                    }
                    break;
            }
        }
    }

    onAnimationEnd(event) {
        this.view.removeAnimation(event);
    }

    onShowNewContent(event) {
        if (event.animationName === 'fade-out') {
            this.view.desk.formContentFromListObjects(this.view.newContent);
            this.view.deskContent.classList.add('fade-in');
        }
    }

    onCreateChat(event) {
        if (event.target.closest('[data-collocutor]')) {
            const collocutor = event.target.closest('[data-collocutor]').getAttribute('data-collocutor');
            ChatModel.getUserChats().then((r) => {
                if (!r.some((chat) => chat.collocutor_name === collocutor)) {
                    ChatModel.createChat(collocutor).then((response) => console.log('new chat'));
                }
                EventBus.emit(Events.pathChanged, {path: '/messages'});
            })
        }
    }
}
