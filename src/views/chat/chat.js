import template from './chat.hbs'

import BaseView from "../BaseView.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Avatar from "../../components/Avatar/Avatar.js";
import Dialog from "../../components/Dialog/Dialog.js";
import Message from "../../components/Dialog/Message/Message.js";


import {fakeMessage} from "../../modules/consts/fake"
import Textarea from "../../components/Textarea-NEEDRENAME/Textarea";

export default class ChatPage extends BaseView {
    constructor(context = {}) {
        super('Сообщения', context, null);
        this.template = template;
    }


    render() {
        const avatar = new Avatar({
            img_link: '/img/img15.jpg',
            middle: true,
        })

        const message = new Dialog({avatar: avatar.render(), ...fakeMessage});
        const cm = new Message(fakeMessage);
        const cmme = new Message({...fakeMessage, own: true});

        const sidebar = new Sidebar({
            id: 'sidebar',
            messages: [message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render()],
        })
        const msgInput = new Textarea({
            id: 'msgInput',
            customInput: 'input-group__field_noresize',
            label: 'Сообщение',
        })

        const data = {
            sidebar: sidebar.render(),
            cm: cm.render(),
            cmme: cmme.render(),
            msgInput: msgInput.render(),
        }
        this.fillWith(data);
        super.render()
    }
}
