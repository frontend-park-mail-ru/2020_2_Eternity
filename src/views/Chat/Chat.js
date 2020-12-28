import template from './Chat.hbs'

import BaseView from "../BaseView.js";
import Sidebar from "../../components/Sidebar/Sidebar.js";
import Avatar from "../../components/Avatar/Avatar.js";
import Dialog from "../../components/Dialog/Dialog.js";
import Message from "../../components/Dialog/Message/Message.js";
import Textarea from "../../components/Textarea/Textarea";
import Button from "../../components/Button/Button";
import List from "../../components/List/List";
import Span from "../../components/Span/Span";
import Dropdown from "../../components/Dropdown/Dropdown";
import EmojiPicker from "../../components/EmojiPicker/EmojiPicker";

import {emoji, sticker} from "../../modules/consts/emoji";
import {Icons} from "../../modules/consts/icons";
import EventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";
import Validator from "../../modules/tools/Validator";
import Image from "../../components/Image/Image";



export default class ChatPage extends BaseView {
    sidebar
    expandToggler
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





        this.btnSmile = new Button({
            id: 'smile',
            customButton: 'btn_with-icon btn_round btn_transparent smile-picker',
            text: Icons.smile,
            dataAttr: 'data-activates="smilesWindow"'
        })
        // this.smiles = new Dropdown({
        //     id: 'smilesWindow',
        //     listtype: 'radio',
        //     customItem: 'emoji-picker__emoji',
        //     custom: 'emoji-picker'
        // })
        this.smiles = new EmojiPicker({
            id: 'smilesWindow',
        })




        this.messages = new List({
            id: 'message-list',
            custom: 'chat__window__messages',
            placeholder: '<div class="chat__window__messages__help">Найдите пользователя, чтобы начать с ним диалог</div>',
            customItem: 'chat__message__wrap',
        })
        this.dialog = new Dialog();

        const messageList = []

        this.checkWindowWidth();

        const data = {
            sidebar: this.sidebar.render(),
            messageList: messageList,
            msgInput: this.msgInput.render(),
            btnSend: this.btnSend.render(),
            smile: this.btnSmile.render(),
            messages: this.messages.render(),
            smiles: this.smiles.render(),
        }
        this.fillWith(data);
        super.render()

        /*document.getElementById('sidebar').setAttribute('style', 'display: none');
        document.getElementById('sidebar').setAttribute('style', 'width: 1px');
*/
        this.expandToggler = document.getElementById('sidebar-toggler');
        this.expandToggler.addEventListener('click', this.onExpand);

        this.btnSend.element.addEventListener('click', this.onSend);
        this.sidebar.element.addEventListener('change', this.onSelectDialog);
        this.btnSmile.element.addEventListener('click', this.onShowEmoji);
        this.smiles.element.addEventListener('change', this.onPutEmoji);
        this.smiles.element.addEventListener('change', this.onEmojiTabChange);
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
        let smileOrSticker;
        let textMsg;

        if (data.msg.slice(1, -1) in sticker) {
            textMsg = new Image({src: sticker[data.msg.slice(1, -1)], alt: data.msg.slice(1, -1), class: 'message__text__sticker'}).render();
            smileOrSticker = 'sticker_chat';
        } else {
            textMsg = data.msg.replace(/\n/g, '<br/>');
            smileOrSticker = emoji.indexOf(data.msg) === -1 ? '' : 'smile';
        }

        const newMsg = new Message({text: textMsg, own: data.owner, time: data.time, custom: smileOrSticker});
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

        /*if (res.length) {
            document.getElementById('sidebar').removeAttribute('style');
            // document.getElementById('sidebar').setAttribute('style', 'width: 1px');
        } else {
            let c = document.getElementById('chat');
            let msg = document.createElement('div')
        }

        if (document.querySelector('.chat__window__messages__help')) {
            document.querySelector('.chat__window__messages__help').innerText = res.length ? 'Выберите чат, чтобы начать общение' : '';
        }*/
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

        if (data.last_msg_content.slice(1, -1) in sticker) {
            data.last_msg_content = 'Стикер';
        }
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
        if (data.msg.slice(1, -1) in sticker) {
            data.msg = 'Стикер';
        }
        dialog.querySelector('.dialog__content__text').innerHTML = data.msg
    }


    inputShow() {
        document.getElementById('chat-footer').classList.remove('hidden')
    }
    inputHide() {
        document.getElementById('chat-footer').classList.add('hidden')
    }
}
