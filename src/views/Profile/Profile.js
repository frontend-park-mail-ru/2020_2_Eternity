import template from "./Profile.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/Avatar/Avatar.js";
import Board from "../../components/Board/Board.js";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Popup from "../../components/Popup/Popup";
import Userbar from "../../components/Userbar/Userbar";
import List from "../../components/List/List";
import {Icons} from "../../modules/consts/icons";


export default class ProfilePage extends BaseView {
    // for followers list in popup
    followPopup
    userbar
    list

    // for profile desk with pins and cards
    pinCard
    boardCard

    content
    renderedPins
    renderedBoards

    // for event listeners
    deskContent
    follow
    followers
    followings
    tabs
    btnMessage
    btnSub


    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = template;

        // TODO: перенести в render и сделать функцию change
        //  (rerender, иначе создается контекст заново и чек на фоловера пропадает)
        this.btnSub = new Button({
            id: 'follow',
        }, {
            follow: {
                text: 'Подписаться',
            },
            unfollow: {
                text: 'Вы подписаны',
                color: 'btn_green',
            }
        })
    }

    render() {
        let pins = [];
        let boards = [];
        this.content = '';
        this.renderedPins = []
        this.renderedBoards = []
        this.pinCard = new Card();
        this.boardCard = new Board();
        this.userbar = new Userbar();
        const avatar = new Avatar({
            img_link: this.context.avatar,
            id: this.context.username,
        });

        const btnMessage = new Button({
            id: 'message',
            text: 'Сообщение',
            dataAttr: 'data-collocutor="' + this.context.username + '"',
        })
        const btnEdit = new Button({
            id: 'edit',
            text: '<i class="fas fa-pen"></i>',
            customButton: 'btn_round profile__edit',
            dataAttr: 'data-link="/profile/edit"',
        })

        this.list = new List({id: 'follows', placeholder: 'Нет пользователей'});
        this.followPopup = new Popup({
            id: 'followPopup',
        })

        if (this.context.pins) {
            this.context.pins.forEach((pin) => {
                this.pinCard.context = pin;
                pins.push(this.pinCard.render());
                this.renderedPins = pins;
            });
        }
        if (this.context.boards) {
            this.context.boards.forEach((board) => {
                this.boardCard.context = board;
                boards.push(this.boardCard.render());
                this.renderedBoards = boards;
            });
        }

        const data = {
            avatar: avatar.render(),
            btnSub: this.btnSub.render(),
            btnEdit: btnEdit.render(),
            btnMessage: btnMessage.render(),
            boards: boards,
            pins: pins,
            followPopup: this.followPopup.render(),
        }

        this.fillWith(data);
        super.render()

        this.follow = document.getElementById('follow');
        this.followers = document.getElementById('userFollowers');
        this.followings = document.getElementById('userFollowings');
        this.tabs = document.querySelector('.profile-tabs');
        this.btnMessage = document.getElementById('message');

        if (this.btnSub.element) {
            this.btnSub.stateNum === 0 ? this.btnSub.element.addEventListener('click', this.onFollow) :
                this.btnSub.element.addEventListener('click', this.onUnfollow);
        }
        if (this.btnMessage) {
            this.btnMessage.addEventListener('click', this.onCreateChat);
        }
        this.followers.addEventListener('click', this.onShowFollowers);
        this.followings.addEventListener('click', this.onShowFollowings);
        this.tabs.addEventListener('change', this.onTabChange);

        this.deskContent =  document.getElementById('desk-content');
        this.deskContent.addEventListener('animationend', this.onAnimationEnd);
        this.deskContent.addEventListener('animationend', this.onShowNewContent);
    }

    formFollowList(users) {
        this.list.clearContent();
        if (users) {
            let list = [];
            users.forEach((user) => {
                const bar = new Userbar({...user});
                list.push(bar);
            })
            this.list.formContentFromListObjects(list);
        }
    }

    changeDeskContent(newContent) {
        this.deskContent.classList.add('fade-out');
        this.content = newContent;
    }

    removeAnimation(event) {
        event.path[0].classList.remove(event.animationName);
    }

    changeUserFollowersNum(num) {
        document.getElementById('userFollowers').innerHTML = num + ' подписчиков';
    }
    changeUserFollowingsNum(num) {
        document.getElementById('userFollowings').innerHTML = num + ' подписок';
    }
}
