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
        EventBus.on(Events.chatLastMessagesReceived, this.formChatContent.bind(this));
        EventBus.on(Events.userChatsReceived, this.formDialogList.bind(this));
    }


    render() {
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
            EventBus.emit(Events.messageSend, {chatId: 1, text: msgInput.value});
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
            const liMsg = this.createMessageToWindow(data);
            msgList.prepend(liMsg);
        }
    }
    formChatContent(data={}) {
        const msgList = document.getElementById('message-list');
        if (msgList) {
            let res = '';
            data.list.forEach((m) => {
                const liMsg = this.createMessageToWindow(m);
                res += liMsg.outerHTML;
            })
            msgList.insertAdjacentHTML('beforeend', res);
        }
    }
    createMessageToWindow(data={}) {
        const newMsg = new Message({text: data.msg, own: data.owner, time: data.time});
        const liMsg = document.createElement('li');

        liMsg.classList.add('chat__message__wrap');
        if (!data.owner) {
            liMsg.classList.add('message__received');
        }
        liMsg.innerHTML = newMsg.render();
        return liMsg;
    }
    // todo: добавить radio под список и туда id
    formDialogList(list) {
        const avatar = new Avatar({
            img_link: '/img/default.svg',
            middle: true,
        })
        let res = [];
        list.forEach((d) => {
            if (d.collocutor_ava) {
                avatar.context.img_link = d.collocutor_ava;
            }
            let t = new Date(d.last_msg_time);
            const dialog = new Dialog({
                avatar: avatar.render(),
                text: d.last_msg_content,
                time: t.getHours() + ':' + t.getMinutes(),
                username: d.collocutor_name
            });
            res.push(dialog.render());
        })
        this.sidebar.formSidebarContent(res);
    }
}
