import template from "./profile.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/avatar/avatar.js";
import Button from "../../components/button/button.js";
import Navbar from "../../components/navbar/navbar.js";

import Board from "../../components/board/board.js";

import {fakeBoard} from "../../modules/consts/fake.js";

export default class ProfilePage extends BaseView {
    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = template;
    }

    render() {
        const avatar = new Avatar({
            imgSrc: this.context.avatarPath,
        });
        const btnMessage = new Button({
            btnText: 'Сообщение'
        })
        const btnSub = new Button({
            btnText: 'Подписаться'
        })
        const board = new Board({...fakeBoard});
        const data = {
            avatar: avatar.render(),
            btnMessage: btnMessage.render(),
            btnSub: btnSub.render(),
            board: board.render()
        }

        this.fillWith(data);
        super.render()
    }
}
