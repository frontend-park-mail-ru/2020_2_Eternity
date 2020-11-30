import template from './Chat.hbs'

import BaseView from "../BaseView.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Avatar from "../../components/Avatar/Avatar.js";
import Dialog from "../../components/Dialog/Dialog.js";
import Message from "../../components/Dialog/Message/Message.js";


import {fakeMessage} from "../../modules/consts/fake"
import Textarea from "../../components/Textarea-NEEDRENAME/Textarea";
import Button from "../../components/Button-NEEDRENAME/Button";
import {Icons} from "../../modules/consts/icons";

export default class ChatPage extends BaseView {
    sidebar

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

        this.sidebar = new Sidebar({
            id: 'sidebar',
            messages: [message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render(), message.render()],
        })
        const msgInput = new Textarea({
            id: 'msgInput',
            customInput: 'input-group__field_noresize',
            label: 'Сообщение',
        })
        const btnSend = new Button({
            id: 'send',
            customButton: 'btn_with-icon btn_round',
            text: Icons.send,
        })

        const messageList = [cmme.render()]

        this.checkWindowWidth();
        window.addEventListener('resize', () => {
            this.checkWindowWidth();
        });
        const data = {
            sidebar: this.sidebar.render(),
            messageList: messageList,
            msgInput: msgInput.render(),
            btnSend: btnSend.render(),
        }
        this.fillWith(data);
        super.render()


        this.addMessage(cm.context, false);
    }

    checkWindowWidth() {
        const width = document.documentElement.clientWidth;
        if (width <= 768) {
            this.sidebar.context.expand = false;
            this.sidebar.deleteExpand();
        } else {
            this.sidebar.context.expand = true;
            this.sidebar.addExpand();
        }
    }

    addMessage(msg, owner) {
        const msgList = document.getElementById('message-list');
        if (msgList) {
            const newMsg = new Message({...msg, own: owner});
            let liMsg = document.createElement('li');

            liMsg.classList.add('chat__message__wrap');
            if (!owner) {
                liMsg.classList.add('message__received');
            }
            liMsg.innerHTML = newMsg.render();
            msgList.prepend(liMsg);
        }
    }
}
