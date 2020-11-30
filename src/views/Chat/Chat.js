import template from './Chat.hbs'

import BaseView from "../BaseView.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Avatar from "../../components/Avatar/Avatar.js";
import Dialog from "../../components/Dialog/Dialog.js";
import Message from "../../components/Dialog/Message/Message.js";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";

import {fakeMessage} from "../../modules/consts/fake"
import {Icons} from "../../modules/consts/icons";
import EventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";

export default class ChatPage extends BaseView {
    sidebar

    constructor(context = {}) {
        super('Сообщения', context, null);
        this.template = template;

        EventBus.on(Events.messageReceived, this.addMessage.bind(this));
    }


    render() {
        const avatar = new Avatar({
            img_link: '/img/img15.jpg',
            middle: true,
        })
        const message = new Dialog({avatar: avatar.render(), ...fakeMessage});

        this.sidebar = new Sidebar({
            id: 'sidebar',
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

        const messageList = []

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

        document.getElementById('send').addEventListener('click', () => {
            EventBus.emit(Events.messageSend, {text: msgInput.value});
            msgInput.clear();
        })

        // TODO: ЭТО ПРИВЯЗАТЬ НА СОБЫТИЕ Events.createChat, в него пихать инфу о собеседнике
        // this.sidebar.addItem(message.render())
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

    addMessage(data={}) {
        const msgList = document.getElementById('message-list');
        if (msgList) {
            const newMsg = new Message({text: data.msg, own: data.owner, time: data.time});
            let liMsg = document.createElement('li');

            liMsg.classList.add('chat__message__wrap');
            if (!data.owner) {
                liMsg.classList.add('message__received');
            }
            liMsg.innerHTML = newMsg.render();
            msgList.prepend(liMsg);
        }
    }
}
