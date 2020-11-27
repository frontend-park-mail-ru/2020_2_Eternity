import template from "./profile.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/Avatar/Avatar.js";
import Board from "../../components/Board/Board.js";
import Cardd from "../../components/card/cardd";
import LabeledToggle from "../../components/Toggle-NEEDRENAME/LabeledToggle/LabeledToggle";

import eventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";
import {routes} from "../../modules/consts/routes";


export default class ProfilePage extends BaseView {
    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = template;
    }

    render() {
        let pins = [];
        let boards = [];

        const avatar = new Avatar({
            imgSrc: this.context.avatar,
            id: this.context.username,
        });

        const toggle = new LabeledToggle({
            id: 'toggle',
            label: 'Пины/Доски',
            small: 'Переключить представление'
        });

        if (this.context.pins) {
            this.context.pins.forEach((pin) => {
                const card = new Cardd(pin);
                pins.push(card.render());
            });
        }

        if (this.context.boards) {
            this.context.boards.forEach((board) => {
                const card = new Board(board);
                boards.push(card.render());
            });
        }

        const data = {
            toggle: toggle.render(),
            avatar: avatar.render(),
            boards: boards,
            pins: pins,
        }

        this.fillWith(data);
        super.render()

        if (document.getElementById('toggle')) {
            document.getElementById('toggle').addEventListener('click', () => {
                let boards = document.getElementById('boards');
                let pins = document.getElementById('pins'); // TODO: Это очень не хорошо, но пока так

                if (toggle.value) {
                    boards.style.display = 'block';
                    pins.style.display = 'none';
                } else {
                    boards.style.display = 'none';
                    pins.style.display = 'block';
                }
            });
        }

        if (document.getElementById('follow')) {
            document.getElementById('follow').addEventListener('click', (event) => {
                eventBus.emit(Events.follow, {event: event});
            })
        }


    }
}
