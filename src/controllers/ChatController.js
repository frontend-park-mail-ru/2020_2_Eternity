import BaseController from "./BaseController.js";
import ChatPage from "../views/Chat/Chat.js";
import ChatModel from "../models/ChatModel";
import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import UserModel from "../models/UserModel";

export default class ChatController extends BaseController {
    constructor() {
        super(new ChatPage());

        ChatModel.connect().then((response) => {
            if (response.ok) {
                console.log('websocket-соединение установлено, можно чатица');
            }
        }).catch((error) => console.log(error))
    }

    on() {
        EventBus.on(Events.messageSend, this.onMessageSend.bind(this));
        EventBus.on(Events.chatCreated, this.onChatCreating.bind(this));
        EventBus.on(Events.messageReceived, this.onMessageReceived.bind(this));
        EventBus.on(Events.getNewMessage, this.onGetNewMessage.bind(this));
        EventBus.on(Events.chatGetLastMessages, this.onGetChatLastMessages.bind(this));
        EventBus.on(Events.chatLastMessagesReceived, this.onListMessagesReceived.bind(this));
        EventBus.on(Events.chatGetHistoryMessages, this.onGetChatHistoryMessages.bind(this));
        EventBus.on(Events.chatHistoryReceived, this.onListMessagesReceived.bind(this));


        ChatModel.getUserChats().then((response) => {
            if (!response.error) {
                console.log(response);
                this.view.formDialogList(response);
            }
        })

        super.on();
    }
    off() {
        EventBus.off(Events.messageSend, this.onMessageSend.bind(this));
        EventBus.off(Events.chatCreated, this.onChatCreating.bind(this));
        EventBus.off(Events.messageReceived, this.onMessageReceived.bind(this));
        EventBus.off(Events.getNewMessage, this.onGetNewMessage.bind(this));
        EventBus.off(Events.chatGetLastMessages, this.onGetChatLastMessages.bind(this));
        EventBus.off(Events.chatLastMessagesReceived, this.onListMessagesReceived.bind(this));
        EventBus.off(Events.chatGetHistoryMessages, this.onGetChatHistoryMessages.bind(this));
        EventBus.off(Events.chatHistoryReceived, this.onListMessagesReceived.bind(this));

        super.off();
    }

    onMessageSend(data={}) {
        ChatModel.send(data.chatId, data.text);
    }
    onChatCreating(data={}) {
        ChatModel.createChat(data.username).then((response) => {
            console.log(response);
            if (!response.error) {
                this.view.addDialog(response);
            }
        })
    }
    onGetNewMessage(data={}) {
        if (!this.view.checkDialogExisting(data.chatId)) {
            this.view.addDialog(data);
        }
        if (this.view.currentChat === data.chatId) {
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
}