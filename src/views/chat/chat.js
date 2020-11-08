import template from './chat.hbs'

import BaseView from "../BaseView.js";
import Sidebar from "../../components/sidebar/sidebar.js";
import Avatar from "../../components/avatar/avatar.js";
import Message from "../../components/message/message.js";
import ChatMessage from "../../components/message/_chat-message/chat-message.js";
import Input from "../../components/input/input.js";
import Button from "../../components/button/button.js";



export default class ChatPage extends BaseView {
    constructor(context = {}) {
        super('Сообщения', context, null);
        this.template = template;
    }


    render() {
        const avatar = new Avatar({
            middle: true,
            imgSrc: '/img/img15.jpg',
        })
        const fakeMessage = {
            username: 'example',
            text: 'Hello! How are you? O you iz Anglii, of course, you have some tea',
            time: '12:58',
        }
        const message = new Message({avatar: avatar.render(), ...fakeMessage});

        const cm = new ChatMessage(fakeMessage);
        const cmme = new ChatMessage({...fakeMessage, my: true});

        const sidebar = new Sidebar({
            id: 'sidebar',
            messages: [message.render(), message.render(), message.render()],
        })
        const msgInput = new Input({
            id: 'msgInput',
            customClasses: 'form__input'
        })
        const btnSend = new Button({
            id: 'btnSend',
            btnText: 'Отправить',
        })

        const data = {
            sidebar: sidebar.render(),
            cm: cm.render(),
            cmme: cmme.render(),
            msgInput: msgInput.render(),
            btnSend: btnSend.render(),
        }
        this.fillWith(data);
        super.render()

        sidebar.bindToggler();
    }
}
