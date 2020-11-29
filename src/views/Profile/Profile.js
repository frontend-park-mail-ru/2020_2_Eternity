import template from "./Profile.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/Avatar/Avatar.js";
import Board from "../../components/Board/Board.js";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";

import eventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";
import {routes} from "../../modules/consts/routes";
import {fakePins} from "../../modules/consts/fake";


export default class ProfilePage extends BaseView {
    pinCard
    boardCard
    renderedPins = []
    renderedBoards = []

    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = template;
        document.addEventListener('change', this.changeTabBind.bind(this))
    }

    render() {
        let pins = [];
        let boards = [];

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
        }

        this.fillWith(data);
        super.render()

        if (document.getElementById('follow')) {
            document.getElementById('follow').addEventListener('click', (event) => {
                eventBus.emit(Events.follow, {event: event});
            })
        }
    }

    checkTabClick(event) {
        return !!(event.target instanceof HTMLInputElement && event.target.closest('.profile-tabs'));
    }

    changeTabBind(event) {
        if (this.checkTabClick(event)) {
            switch(event.target.id.replace('tab', '')) {
                case 'pin':
                    this.changeDeskContent(this.renderedPins.join('\n'));
                    break;
                case 'board':
                    this.changeDeskContent(this.renderedBoards.join('\n'));
                    break;
                default:
                    const all = [...this.renderedPins, ...this.renderedBoards];
                    this.changeDeskContent(all.join('\n'));
                    break;
            }
        }
    }

    changeDeskContent(newContent) {
        document.getElementById('desk-content').innerHTML = newContent;
    }
}
