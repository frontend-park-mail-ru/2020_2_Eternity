import template from "./profile.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/avatar/avatar.js";
import Button from "../../components/button/button.js";
import Navbar from "../../components/navbar/navbar.js";

import Board from "../../components/board/board.js";

import {fakeBoard} from "../../modules/consts/fake.js";
import Card from "../../components/card/card";
import LabeledToggle from "../../components/toggle/_labeled-toggle/labeled-toggle";

export default class ProfilePage extends BaseView {
    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = template;
    }

    render() {
        let list = [];

        const avatar = new Avatar({
            imgSrc: this.context.avatar,
        });

        const toggle = new LabeledToggle({
            id: 'toggle',
            label: 'Пины/Доски',
            small: 'Переключить представление'
        });

        const board = new Board({...fakeBoard});

        if (this.context.pins) {
            this.context.pins.forEach((pin) => {
                const card = new Card(pin);
                list.push(card.render());
            });
        }

        const data = {
            toggle: toggle.render(),
            avatar: avatar.render(),
            board: board.render(),
            pins: list
        }

        this.fillWith(data);
        super.render()

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
        }).bind(this);
    }
}
