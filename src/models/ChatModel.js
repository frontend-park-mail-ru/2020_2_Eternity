import request from "../modules/request/Request.js";
import ws from "../modules/websocket/websocket";
import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import UserModel from "./UserModel";

class ChatModel {
    // TODO: адрес бэка
    socket = new WebSocket('ws://localhost:8008/chat/ws');

    constructor() {
        EventBus.on(Events.userLogin, this.initWS.bind(this));
        // TODO: закрыть WS по логауту
        // EventBus.on(Events.userLogout, )
        this.initWS();
    }

    initWS() {
        UserModel.getProfile().then((response) => {
            if (!response.error) {
                ws.on(this.socket, {EventBus, Events}, response.username);
            }
        })
    }

    send(text, owner) {
        // TODO: упростить owner (в WS он уже есть)
        ws.sendMessage(this.socket, text, owner);
    }
    // id чата наверное
    startChat(id) {
    }
    getHistory(id) {
    }
    getChats() {
    }


}

export default new ChatModel();