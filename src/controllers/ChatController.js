    import BaseController from "./BaseController.js";
import ChatPage from "../views/Chat/Chat.js";
import ChatModel from "../models/ChatModel";
import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import UserModel from "../models/UserModel";

export default class ChatController extends BaseController {
    expandDelayMs = 300

    constructor() {
        super(new ChatPage());

        ChatModel.connect().then((response) => {
            if (response.ok) {
                console.log('websocket-соединение установлено, можно чатица');
            }
        }).catch((error) => console.log(error))

        this.view.onExpand = this.onExpand.bind(this);
        this.view.onSend = this.onSend.bind(this);
        this.view.onSelectDialog = this.onSelectDialog.bind(this);
        this.onResizeExpandSidebar = this.onResizeExpandSidebar.bind(this);
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

        ChatModel.getUserChats().then((response) => {
            if (!response.error) {
                this.view.formDialogList(response);
            }
        })

        super.on();
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
        this.view.sidebar.element.addEventListener('change', this.view.onSelectDialog);

        window.removeEventListener('resize', this.debounce(this.onResizeExpandSidebar, this.expandDelayMs));

        super.off();
    }

    onMessageSend(data={}) {
        ChatModel.send(data.chatId, data.text);
    }
    onGetNewMessage(data={}) {
        if (!this.view.checkDialogExisting(data.chatId)) {
            this.view.addDialog(data);
        }
        if (this.view.currentChat === data.chatId.toString()) {
            EventBus.emit(Events.messageReceived, data);
        } else {
            this.view.updateDialog(data);
        }
    }
    onGetChatLastMessages(data={}) {
        ChatModel.getLastMessages(data.chatId)
    }
    onGetChatHistoryMessages(data={}) {
        ChatModel.getHistoryMessages(data.chatId, data.lastMessageId)
    }
    onMessageReceived(data={}) {
        this.view.addMessage(data)
        this.view.updateDialog(data);
    }
    onListMessagesReceived(data={}) {
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

        return function() {
            let self = this;
            const functionCall = function() {
                return func.apply(self, arguments);
            };
            clearTimeout(timeout);
            timeout = setTimeout(functionCall, ms);
        }
    }
}