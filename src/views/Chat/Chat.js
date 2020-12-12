import template from './Chat.hbs'

import BaseView from "../BaseView.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Avatar from "../../components/Avatar/Avatar.js";
import Dialog from "../../components/Dialog/Dialog.js";
import Message from "../../components/Dialog/Message/Message.js";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import List from "../../components/List/List";

import {Icons} from "../../modules/consts/icons";
import EventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";
import Validator from "../../modules/tools/Validator";

export default class ChatPage extends BaseView {
    sidebar
    dialog
    currentChat

    msgInput
    btnSend

    messages

    constructor(context = {}) {
        super('Сообщения', context, null);
        this.template = template;
    }

    render() {
        this.sidebar = new Sidebar({
            id: 'sidebar',
            listtype: 'radio',
        })
        this.msgInput = new Textarea({
            id: 'msgInput',
            customInput: 'input-group__field_noresize',
            label: 'Сообщение',
            noMessageForError: true,
        }, Validator.validateEmptyField)
        this.btnSend = new Button({
            id: 'send',
            customButton: 'btn_with-icon btn_round',
            text: Icons.send,
        })
        this.btnAttach = new Button({
            id: 'attach',
            customButton: 'btn_with-icon btn_round',
            text: Icons.attach,
        })
        this.btnSmile = new Button({
            id: 'smile',
            customButton: 'btn_with-icon btn_round smile-picker',
            text: Icons.smile,
        })
        this.messages = new List({
            id: 'message-list',
            custom: 'chat__window__messages',
            placeholder: '<div class="chat__window__messages__help">Выберите чат, чтобы начать общение</div>',
            customItem: 'chat__message__wrap',
        })
        this.dialog = new Dialog();

        const messageList = []


        // ------------------------------------------------------------
        this.checkWindowWidth();
        window.addEventListener('resize', () => {
            this.checkWindowWidth();
        });
        // ------------------------------------------------------------

        const data = {
            sidebar: this.sidebar.render(),
            messageList: messageList,
            msgInput: this.msgInput.render(),
            btnSend: this.btnSend.render(),
            btnAttach: this.btnAttach.render(),
            smile: this.btnSmile.render(),
            messages: this.messages.render(),
        }
        this.fillWith(data);
        super.render()

        this.btnSend.element.addEventListener('click', this.onSend);
        this.sidebar.element.addEventListener('change', this.onSelectDialog);
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

    /** --------------
     * MESSAGES
     * ---------------
     */
    addMessage(data={}) {
        const newMsg = this.createMessageToWindow(data);
        this.messages.addItem(newMsg, 'prepend');
    }
    createMessageToWindow(data={}) {
        const newMsg = new Message({text: data.msg, own: data.owner, time: data.time});
        if (!data.owner) {
            newMsg.extra = 'message__received';
        }
        return newMsg;
    }
    formChatContent(data={}) {
        let res = [];
        data.list.forEach((m) => {
            const item = this.createMessageToWindow(m);
            res.push(item);
        })
        this.messages.formContentFromListObjects(res);
    }
    clearChatArea() {
        this.messages.clearContent();
    }


    /** --------------
     * DIALOGS
     * ---------------
     */
    formDialogList(list) {
        let res = [];
        list.forEach((d) => {
            const item = this.createDialogToWindow(d);
            res.push(item);
        })
        this.sidebar.formContent(res);
    }
    addDialog(data={}) {
        this.sidebar.addItem(this.createDialogToWindow(data));
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

        return new Dialog({
            id: data.id,
            avatar: avatar.render(),
            text: data.last_msg_content,
            time: t.getHours() + ':' + t.getMinutes(),
            username: data.collocutor_name
        })
    }
    checkDialogExisting(chatId) {
        return document.getElementById(chatId);
    }
    updateDialog(data={}) {
        data.chatId = data.chatId || this.currentChat;
        const dialog = document.getElementById(data.chatId);
        dialog.querySelector('.message__info__time').innerHTML = data.time;
        dialog.querySelector('.dialog__content__text').innerHTML = data.msg
    }


    inputShow() {
        document.getElementById('chat-footer').classList.remove('hidden')
    }
    inputHide() {
        document.getElementById('chat-footer').classList.add('hidden')
    }
}
