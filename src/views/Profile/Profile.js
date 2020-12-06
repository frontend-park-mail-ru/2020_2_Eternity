import template from "./Profile.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/Avatar/Avatar.js";
import Board from "../../components/Board/Board.js";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Popup from "../../components/Popup/Popup";
import Userbar from "../../components/Userbar/Userbar";
import List from "../../components/List/List";


export default class ProfilePage extends BaseView {
    followPopup
    userbar
    list
    pinCard
    boardCard
    deskContent
    content
    renderedPins
    renderedBoards

    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = template;
    }

    render() {
        let pins = [];
        let boards = [];
        this.content = '';
        this.renderedPins = []
        this.renderedBoards = []

        const avatar = new Avatar({
            img_link: this.context.avatar,
            id: this.context.username,
        });
        const btnSub = new Button({
            id: 'follow',
            text: 'Подписаться',
        })
        const btnMessage = new Button({
            id: 'message',
            text: 'Сообщение',
            link: true,
            href: '/messages',
        })
        const btnEdit = new Button({
            id: 'edit',
            text: '<i class="fas fa-pen"></i>',
            customButton: 'btn_round profile__edit',
            link: true,
            href: '/profile/edit',
        })
        this.pinCard = new Card();
        this.boardCard = new Board();
        this.userbar = new Userbar();
        this.list = new List({id: 'follows'});
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
            btnSub: btnSub.render(),
            btnEdit: btnEdit.render(),
            btnMessage: btnMessage.render(),
            boards: boards,
            pins: pins,
            followPopup: this.followPopup.render(),
        }

        this.fillWith(data);
        super.render()

        const follow = document.getElementById('follow');
        const followers = document.getElementById('userFollowers');
        const followings = document.getElementById('userFollowings');
        const tabs = document.querySelector('.profile-tabs');
        this.deskContent =  document.getElementById('desk-content');

        if (follow) {
            follow.addEventListener('click', this.onFollow);
        }
        followers.addEventListener('click', this.onShowFollowers);
        followings.addEventListener('click', this.onShowFollowings);
        tabs.addEventListener('change', this.onTabChange);
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
