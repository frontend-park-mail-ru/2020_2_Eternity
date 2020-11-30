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
        super.on();
    }
    off() {
        EventBus.off(Events.messageSend, this.onMessageSend.bind(this));
        super.off();
    }

    onMessageSend(data={}) {
        UserModel.getProfile().then((response) => {
            if (!response.error) {
                ChatModel.send(data.text, response.username);
            }
        });
    }
}