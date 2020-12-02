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
    currentChat

    constructor(context = {}) {
        super('Сообщения', context, null);
        this.template = template;
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
            EventBus.emit(Events.messageSend, {chatId: this.currentChat, text: msgInput.value});
            msgInput.clear();
        })
        // todo: по хорошему sidebar надо переписать, чтоб можно было обращаться к инпутам через него
        document.addEventListener('change', (event) => {
            if (event.target instanceof HTMLInputElement && event.target.closest('.sidebar__list__item__radio')) {
                this.currentChat = event.target.value;
                this.clearChatArea();
                EventBus.emit(Events.chatGetLastMessages, {chatId: this.currentChat})
            }
        })
    }

    get currentChat() {
        return this.currentChat;
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
        return liMsg
    }

    formDialogList(list) {
        let res = [];
        list.forEach((d) => {
            const item = this.createDialogToWindow(d);
            res.push(item);
        })
        this.sidebar.formSidebarContent(res);
    }
    addDialog(data={}) {
        const newDialog = this.createDialogToWindow(data);
        this.sidebar.addItem(newDialog.rendered, newDialog.value);
    }
    createDialogToWindow(data={}) {
        const avatar = new Avatar({
            img_link: '/img/default.svg',
            middle: true,
        })
        if (data.collocutor_ava) {
            avatar.context.img_link = data.collocutor_ava;
        }
        let t = new Date(data.last_msg_time);
        const dialog = new Dialog({
            avatar: avatar.render(),
            text: data.last_msg_content,
            time: t.getHours() + ':' + t.getMinutes(),
            username: data.collocutor_name
        });
        return {rendered: dialog.render(), value: data.id};
    }

    clearChatArea() {
        const msgList = document.getElementById('message-list');
        msgList.innerHTML = ''
    }
    checkDialogExisting(chatId) {
        return this.sidebar.findItemById(chatId);
    }
    updateDialog(data={}) {
        if (!data.chatId) {
            data.chatId = this.currentChat
        }
        const dialog = this.sidebar.getItemById(data.chatId);
        const dialogTime = dialog.querySelector('.message__info__time')
        const dialogContent = dialog.querySelector('.dialog__content__text')
        dialogTime.innerHTML = data.time;
        dialogContent.innerHTML = data.msg
    }
}
