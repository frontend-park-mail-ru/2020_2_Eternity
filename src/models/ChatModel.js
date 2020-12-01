import request from "../modules/request/Request.js";
import ws from "../modules/websocket/websocket";
import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import UserModel from "./UserModel";

class ChatModel {
    socket

    constructor() {
        EventBus.on(Events.userLogin, this.connect.bind(this));
        // TODO: закрыть WS по логауту
        // EventBus.on(Events.userLogout, )
        this.initWS();
    }

    connect() {
        return request.createWSConnect().then((response) => {
            if (response.ok) {
                // TODO: адрес бэка в конфиг какой нибудь вынести
                this.socket = new WebSocket('ws://localhost:8008/ws');
                this.initWS();
            }
            return response;
        })
    }
    initWS() {
        UserModel.getProfile().then((response) => {
            if (!response.error) {
                ws.on(this.socket, {EventBus, Events}, response.username);
            }
        })
    }

    send(chatId, text) {
        ws.sendMessage(this.socket, chatId, text);
    }
    getLastMessages(chatId = 1) {
        ws.sendGetLastMessages(this.socket, chatId)
    }
    getHistoryMessages(chatId=1, lastMessageId=10) {
        ws.sendGetHistoryMessages(this.socket, chatId, lastMessageId);
    }
    createChat(username) {
        return request.createChat(username).then((response) => {
            return response.json();
        })
    }
    getUserChats() {
        return request.getUserChats().then((response) => {
            return response.json();
        })
    }

}

export default new ChatModel();