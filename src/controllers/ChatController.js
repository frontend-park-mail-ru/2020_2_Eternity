import BaseController from "./BaseController.js";
import ChatPage from "../views/Chat/Chat.js";
import ChatModel from "../models/ChatModel";
import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import UserModel from "../models/UserModel";

export default class ChatController extends BaseController {
    constructor() {
        super(new ChatPage());
    }

    on() {
        EventBus.on(Events.messageSend, this.onMessageSend.bind(this));
        EventBus.on(Events.chatCreated, this.onChatCreating.bind(this));

        ChatModel.connect().then((response) => {
            if (response.ok) {
                console.log('websocket-соединение установлено, можно чатица');
            }
        }).catch((error) => console.log(error))

        super.on();
    }
    off() {
        EventBus.off(Events.messageSend, this.onMessageSend.bind(this));
        EventBus.off(Events.chatCreated, this.onChatCreating.bind(this));
        super.off();
    }

    onMessageSend(data={}) {
        // UserModel.getProfile().then((response) => {
        //     if (!response.error) {
        //
        //     }
        // });
        ChatModel.send(data.chatId, data.text);
    }
    onChatCreating(data={}) {
        ChatModel.createChat(data.username).then((response) => {
            console.log(response);
        })
    }
}