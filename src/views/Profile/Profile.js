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
import Span from "../../components/Span/Span";


export default class ProfilePage extends BaseView {
    // for followers list in popup
    followPopup
    userbar
    list

    // for profile desk with pins and cards
    desk
    newContent
    pins
    boards
    mboards

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
        this.mboards = {};
    }

    render() {
        this.pins = []
        this.boards = []
        this.newContent = []

        this.userbar = new Userbar();

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

        const avatar = new Avatar({
            img_link: '',
            id: this.context.username,
            custom: 'load-animation load-animation_round',
        });
        this.list = new List({id: 'follows', placeholder: 'Нет пользователей'});
        this.followPopup = new Popup({
            id: 'followPopup',
        })

        this.desk = new List({
            id: 'desk-content',
            custom: 'desk__grid',
            customItem: 'desk__grid__item',
        })

        /**
         * Заполнения доски загрузочными карточками с анимацией ---------------------------------
         * Закомментила, потому что с быстрым инетом зачастую выглядит некрасиво
         * По два раза прогружается и страница мерцает будто
         */
        // const loadingCard = new Card({
        //     custom: 'load-animation',
        // })
        // let pl = [];
        // for (let i = 0; i < 5; i++) {
        //     pl.push(loadingCard);
        // }
        // this.desk.formContentFromListObjects(pl)
        /** ------------------------------------------------------------------------------------- */

        const loading = this.createTextLoadingElement().outerHTML;
        const data = {
            avatar: avatar.render(),
            name: loading,
            surname: loading,
            username: loading,
            description: this.createDescriptionLoading().outerHTML,
            followPopup: this.followPopup.render(),
            desk: this.desk.render(),
        }

        this.fillWith(data);
        super.render()

        this.followers = document.getElementById('userFollowers');
        this.followings = document.getElementById('userFollowings');
        this.tabs = document.querySelector('.profile-tabs');

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
        this.newContent = newContent;
    }

    removeAnimation(event) {
        event.path[0].classList.remove(event.animationName);
    }

    setWord(num, type) {
        let word;
        switch (parseInt(num) % 10) {
            case 1:
                word = type === 'followers' ? ' подписчик' : ' подписка';
                break;
            case 2:
            case 3:
            case 4:
                word = type === 'followers' ? ' подписчика' : ' подписки';
                break;
            default:
                word = type === 'followers' ? ' подписчиков' : ' подписок';
                break;
        }
        return word;
    }

    changeUserFollowersNum(num) {
        document.getElementById('userFollowers').innerText = num + this.setWord(num, 'followers');
    }
    changeUserFollowingsNum(num) {
        document.getElementById('userFollowings').innerText = num + this.setWord(num, 'followings');
    }

    createTextLoadingElement() {
        const node = document.createElement('span');
        node.className = 'load-animation load-animation_short';
        return node;
    }
    createDescriptionLoading() {
        const node = document.createElement('span');
        node.className = 'load-animation';
        node.style.display = 'block';
        node.style.minHeight = '1.5rem';
        return node;
    }

    load(data) {
        this.loadAvatar(data.avatar);
        this.loadUserInfo(data);
        this.loadCreateActions();
    }

    loadAvatar(avatar) {
        const curr = document.querySelector('.profile-card__user-avatar');

        const ava = new Avatar({
            img_link: avatar,
        });
        curr.innerHTML = ava.render();
        if (this.context.edit) {
            const btnEdit = new Button({
                id: 'edit',
                text: '<i class="fas fa-pen"></i>',
                customButton: 'btn_round profile__edit',
                dataAttr: 'data-link="/profile/edit"',
            })
            curr.insertAdjacentHTML('afterbegin', btnEdit.render());
        }
    }

    loadUserInfo(data) {
        const [name, username, description, follows, actions] = document.querySelector('.profile-card__user-info')
                                                                        .querySelectorAll('li');
        name.innerText = data.name + ' ' + data.surname;
        username.innerText = '@' + data.username;
        description.innerText = data.description.replace(/&gt;/g, '>').replace(/&lt;/g, '<');

        this.changeUserFollowersNum(data.followers);
        this.changeUserFollowingsNum(data.following);
        follows.querySelectorAll('a').forEach((link) => link.href = data.username);

        // LOAD ACTIONS
        if (this.context.show) {
            const btnMessage = new Button({
                id: 'message',
                text: 'Сообщение',
                dataAttr: 'data-collocutor="' + data.username + '"',
            })
            actions.insertAdjacentHTML('beforeend', btnMessage.render());
            actions.insertAdjacentHTML('beforeend', this.btnSub.render());

            this.btnMessage = document.getElementById('message');
            this.follow = document.getElementById('follow');

            this.btnSub.stateNum === 0 ? this.btnSub.element.addEventListener('click', this.onFollow) :
                                         this.btnSub.element.addEventListener('click', this.onUnfollow);
            this.btnMessage.addEventListener('click', this.onCreateChat);
        }
    }

    loadCreateActions() {
        if (this.context.edit) {
            const btnCreatePin = new Button({
                text: '<span class="profile-desk__create__linktext">Создать пин</span> ' + Icons.add,
                customButton: 'btn_with-icon',
                dataAttr: 'data-link="/create-pin"',
            })
            const btnCreateBoard = new Button({
                text: '<span class="profile-desk__create__linktext">Создать доску</span> ' + Icons.board,
                customButton: 'btn_with-icon',
                dataAttr: 'data-link="/create-board"',
            })

            const node = document.querySelector('.profile-desk__create');
            node.insertAdjacentHTML('beforeend', btnCreatePin.render());
            node.insertAdjacentHTML('beforeend', btnCreateBoard.render());
        }
    }

    loadDesk() {
        if (this.context.pins) {
            this.context.pins.forEach((pin) => {
                const nc = new Card(pin, true);
                this.pins.push(nc);
            });
        }
        if (this.context.boards) {
            this.context.boards.forEach((board) => {
                this.mboards[board.id] = new Board(board);
            });
        }
        this.boards = Object.values(this.mboards);

        if (this.pins.length === 0 && this.boards.length === 0) {
            const help = new Span({custom: 'profile__info__help'})
            help.context.text = 'У пользователя нет досок или пинов';
            document.getElementById('desk-content').innerHTML = help.render()
        } else {
            this.desk.formContentFromListObjects([...this.pins, ...this.boards]);
        }

    }
}
