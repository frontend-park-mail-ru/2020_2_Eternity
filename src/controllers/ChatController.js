import BaseController from "./BaseController.js";
import ChatPage from "../views/Chat/Chat.js";
import ChatModel from "../models/ChatModel";
import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import UserModel from "../models/UserModel";
import {Icons} from "../modules/consts/icons";

export default class ChatController extends BaseController {
    expandDelayMs = 300
    connected
    pressedKeys = {}

    constructor() {
        super(new ChatPage());

        this.view.onExpand = this.onExpand.bind(this);
        this.view.onSend = this.onSend.bind(this);
        this.view.onSelectDialog = this.onSelectDialog.bind(this);
        this.onResizeExpandSidebar = this.onResizeExpandSidebar.bind(this);
        this.view.onShowEmoji = this.onShowEmoji.bind(this);
        this.view.onPutEmoji = this.onPutEmoji.bind(this);
        this.view.onEmojiTabChange = this.onEmojiTabChange.bind(this);
        this.sendMessageOnEnter = this.sendMessageOnEnter.bind(this, this.pressedKeys);
    }

    on() {
        EventBus.on(Events.messageSend, this.onMessageSend.bind(this));
        EventBus.on(Events.messageReceived, this.onMessageReceived.bind(this));
        EventBus.on(Events.getNewMessage, this.onGetNewMessage.bind(this));
        EventBus.on(Events.chatGetLastMessages, this.onGetChatLastMessages.bind(this));
        EventBus.on(Events.chatLastMessagesReceived, this.onListMessagesReceived.bind(this));
        EventBus.on(Events.chatGetHistoryMessages, this.onGetChatHistoryMessages.bind(this));
        EventBus.on(Events.chatHistoryReceived, this.onListMessagesReceived.bind(this));

        window.addEventListener('resize', this.debounce(this.onResizeExpandSidebar, this.expandDelayMs));

        ChatModel.connect().then(() => {
            this.connected = true;
            this.openConnection();
        }).catch((error) => console.log(error))

        if (this.connected) {
            this.openConnection();
        }

        document.addEventListener('keydown',  this.sendMessageOnEnter);

        document.addEventListener('keyup', (event) => {
            delete this.pressedKeys[event.key];
        });

        super.on();
    }

    sendMessageOnEnter(pressedKeys, event) {
        pressedKeys[event.key] = true;

        if (document.activeElement === document.getElementById(this.view.msgInput.context.id) && event.key === 'Enter' && !this.pressedKeys['Shift']) {
            event.preventDefault();
            this.onSend();
        }
    }

    openConnection() {
        ChatModel.getUserChats().then((response) => {
            if (!response.error) {
                this.view.formDialogList(response);
                document.getElementById('message-list').classList.add('fade-in')
                const firstDialog = this.view.sidebar.element.querySelector('.list__item__input')
                firstDialog.setAttribute('checked', 'checked');
                this.onSelectDialog({target: firstDialog});
            }
        })
    }

    off() {
        EventBus.off(Events.messageSend, this.onMessageSend.bind(this));
        EventBus.off(Events.messageReceived, this.onMessageReceived.bind(this));
        EventBus.off(Events.getNewMessage, this.onGetNewMessage.bind(this));
        EventBus.off(Events.chatGetLastMessages, this.onGetChatLastMessages.bind(this));
        EventBus.off(Events.chatLastMessagesReceived, this.onListMessagesReceived.bind(this));
        EventBus.off(Events.chatGetHistoryMessages, this.onGetChatHistoryMessages.bind(this));
        EventBus.off(Events.chatHistoryReceived, this.onListMessagesReceived.bind(this));

        this.view.expandToggler.removeEventListener('click', this.view.onExpand);
        this.view.btnSend.element.removeEventListener('click', this.view.onSend);
        this.view.sidebar.element.removeEventListener('change', this.view.onSelectDialog);
        this.view.btnSmile.element.removeEventListener('click', this.view.onShowEmoji);
        this.view.smiles.element.removeEventListener('change', this.view.onPutEmoji);
        this.view.smiles.element.removeEventListener('change', this.view.onEmojiTabChange);

        window.removeEventListener('resize', this.debounce(this.onResizeExpandSidebar, this.expandDelayMs));

        document.removeEventListener('keydown',  this.sendMessageOnEnter);

        document.removeEventListener('keyup', (event) => {
            delete this.pressedKeys[event.key];
        });

        super.off();
    }

    onMessageSend(data = {}) {
        ChatModel.send(data.chatId, data.text);
    }

    onGetNewMessage(data = {}) {
        if (!this.view.checkDialogExisting(data.chatId)) {
            this.view.addDialog(data);
        }
        if (this.view.currentChat === data.chatId.toString()) {
            EventBus.emit(Events.messageReceived, data);
        } else {
            this.view.updateDialog(data);
        }
    }

    onGetChatLastMessages(data = {}) {
        ChatModel.getLastMessages(data.chatId)
    }

    onGetChatHistoryMessages(data = {}) {
        ChatModel.getHistoryMessages(data.chatId, data.lastMessageId)
    }

    onMessageReceived(data = {}) {
        this.view.addMessage(data)
        this.view.updateDialog(data);
    }

    onListMessagesReceived(data = {}) {
        this.view.formChatContent(data)
    }

    onSend() {
        this.view.msgInput.checkValid();
        if (!this.view.msgInput.hasError()) {
            EventBus.emit(Events.messageSend, {chatId: this.view.currentChat, text: this.view.msgInput.value});
            this.view.msgInput.clear();
        }
    }

    onSelectDialog(event) {
        if (event.target instanceof HTMLInputElement) {
            this.view.currentChat = event.target.value;
            this.view.clearChatArea();
            EventBus.emit(Events.chatGetLastMessages, {chatId: this.view.currentChat});
            this.view.inputShow();
        }
    }

    onExpand(event) {
        event.preventDefault();
        const origin = event.target.closest('#sidebar-toggler');
        if (origin) {
            this.view.sidebar.getAside();
            this.view.sidebar.expandOnToggler();
        }
    }

    onResizeExpandSidebar() {
        this.view.checkWindowWidth();
    }

    debounce(func, ms) {
        let timeout;

        return function () {
            let self = this;
            const functionCall = function () {
                return func.apply(self, arguments);
            };
            clearTimeout(timeout);
            timeout = setTimeout(functionCall, ms);
        }
    }

    onShowEmoji(event) {
        const origin = event.target.closest('[data-activates]');
        if (origin) {
            const targetSelector = origin.getAttribute('data-activates');
            this.view.smiles.origin = origin;
            this.view.smiles.dropdown = document.getElementById(targetSelector);
            this.view.smiles.isOpened ? this.view.smiles.hide() : this.view.smiles.show();
        }
    }

    onPutEmoji(event) {
        const emojiOrigin = event.target.nextElementSibling.querySelector('.emoji');
        const stickerOrigin = event.target.nextElementSibling.querySelector('.sticker');
        if (emojiOrigin) {
            this.sendEmoji(emojiOrigin);
        }
        if (stickerOrigin) {
            this.sendSticker(stickerOrigin);
        }
    }

    sendEmoji(emojiOrigin) {
        this.view.smiles.flushSelectedItems();
        const currPos = this.view.msgInput.element.selectionStart;
        const curValue = this.view.msgInput.value;
        this.view.msgInput.element.value = curValue.substring(0, currPos) + emojiOrigin.textContent + curValue.substring(currPos);
        this.view.msgInput.element.focus();
        this.view.msgInput.element.setSelectionRange(currPos + 2, currPos + 2);
    }

    sendSticker(stickerOrigin) {
        this.view.smiles.flushSelectedItems();
        const sticker = ':' + stickerOrigin.getAttribute('alt') + ':';
        EventBus.emit(Events.messageSend, {chatId: this.view.currentChat, text: sticker});
    }

    onEmojiTabChange(event) {
        const tabOrigin = event.target.closest('.emoji-picker__tabs__tab__input');
        if (tabOrigin) {
            const windowFor = tabOrigin.getAttribute('id');
            if (windowFor === 'smiles') {
                this.view.smiles.list.formContentFromListObjects(this.view.smiles.emojis);
            } else {
                this.view.smiles.list.formContentFromListObjects(this.view.smiles.pack);
            }
        }
    }
}