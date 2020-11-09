import template from "./profile.hbs"

import BaseView from "../BaseView.js";

import Avatar from "../../components/avatar/avatar.js";
import ButtonLink from "../../components/button/_button-link/button-link.js";

import Board from "../../components/board/board.js";

import {fakeBoard} from "../../modules/consts/fake.js";
import {routes} from "../../modules/consts/routes";


export default class ProfilePage extends BaseView {
    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = template;
    }

    render() {
        const avatar = new Avatar({
            imgSrc: this.context.avatar,
        });
        const btnLinkMessages = new ButtonLink({
            href: '/messages',
            text: 'Сообщение',
        })
        const btnLinkSub = new ButtonLink({
            id: 'subscribe',
            text: 'Подписаться',
        })

        const board = new Board({...fakeBoard});
        const data = {
            avatar: avatar.render(),
            board: board.render(),
            btnLinkMessages: btnLinkMessages.render(),
            btnLinkSub: btnLinkSub.render(),
        }

        this.fillWith(data);
        super.render()

        btnLinkSub.bind('btn__link_sub');
    }
}
