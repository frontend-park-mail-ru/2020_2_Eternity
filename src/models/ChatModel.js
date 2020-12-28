import request from "../modules/request/Request.js";
import ws from "../modules/websocket/websocket";

import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import UserModel from "./UserModel";

class ChatModel {
    // TODO: адрес бэка в конфиг какой нибудь вынести
    socketURL = 'wss://pinteo.ru/api/ws';
    socket = new WebSocket(this.socketURL);

    constructor() {
        EventBus.on(Events.onLogin, this.openSocket.bind(this), this.connect.bind(this));
        EventBus.on(Events.userLogout, this.closeConnect.bind(this));
        // TODO: закрыть WS по логауту
        // EventBus.on(Events.userLogout, )
    }

    connect() {
        return request.createWSConnect().then((response) => {
            if (response.ok) {
                return UserModel.getProfile().then((response) => {
                    if (!response.error) {
                        ws.on(this.socket, {EventBus, Events}, response.username);
                    }
                })
            }
            // return new Promise(((resolve) => {
            //     this.socket.onopen = () => {
            //         console.log('соединение с чатиком установлено');
            //         resolve(true);
            //     }
            // }))
        })
    }

    openSocket() {
        this.socket = new WebSocket(this.socketURL);
    }

    closeConnect() {
        this.socket.close();
    }

    send(chatId, text) {
        ws.sendMessage(this.socket, chatId, text);
    }
    getLastMessages(chatId) {
        ws.sendGetLastMessages(this.socket, chatId)
    }
    getHistoryMessages(chatId, lastMessageId) {
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
    getChatById(chatId) {
        return request.getChatById(chatId).then((response) => {
            return response.json();
        })
    }

}

export default new ChatModel();