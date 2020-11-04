import template from "./profile.hbs"

import Base from "../base.js";

import Avatar from "../../components/avatar/avatar.js";
import Button from "../../components/button/button.js";
import Navbar from "../../components/navbar/navbar";


export default class ProfilePage extends Base {
    constructor(context = {}) {
        super('Профиль', context, null);
        this.template = template;
    }

    render() {
        const navbar = new Navbar();
        const avatar = new Avatar({
            imgSrc: this.context.avatarPath,
        });
        const btnMessage = new Button({
            btnText: 'Сообщение'
        })
        const btnSub = new Button({
            btnText: 'Подписаться'
        })

        const data = {
            navbar: navbar.render(),
            avatar: avatar.render(),
            btnMessage: btnMessage.render(),
            btnSub: btnSub.render(),
        }

        this.fillWith(data);
        super.render()
    }
}
