import {requestTypeWS, responseTypeWS} from "./messageTypes";
import EventBus from "../tools/EventBus";

export default class ws {
    /**
     * Базовая функция для отсылки сообщений разных типов на сервер (уведомление о подписке, сообщение, отписка, лайк и тд)
     * @param {WebSocket} socket
     * @param {string} method - type
     * @param data
     */
    static sendCommand(socket, method, data = {}) {
        const msg = {
            type: method,
            data: this.encodeUTF8(JSON.stringify(data)),
        };
        // TODO: сюда нужен промис, иначе вебсокет будет ругаться что не открыт или занят
        // socket.onopen = () => {  socket.send(JSON.stringify(msg)) };
        socket.send(JSON.stringify(msg))
    }

    /**
     * Подписка на приходящие сообщения
     * @param {WebSocket} socket
     * @param store - {инициатор событий (EventBus), событие (Events)}
     * @param {string} username - сторона, открывающая сокет
     */
    static on(socket, store, username) {
        socket.onmessage = (response) => {
            ws.onResponse(store, response, socket, username);
        }
    }

    /**
     * Функция уведомляет бэк о том что отправлено сообщение
     * @param socket
     * @param chatId
     * @param text
     */
    static sendMessage(socket, chatId, text) {
        ws.sendCommand(socket, requestTypeWS.createMessage, {chat_id: parseInt(chatId), content: text});
    }

    static sendGetLastMessages(socket, chatId) {
        ws.sendCommand(socket, requestTypeWS.getLastMessages, {chat_id: parseInt(chatId), messages: 15})
    }

    static sendGetHistoryMessages(socket, chatId, lastMessageId) {
        ws.sendCommand(socket, requestTypeWS.getHistoryMessages, {
            chat_id: chatId,
            n_messages: 15,
            message_id: lastMessageId
        });
    }


    /**
     * Поведение в зависимости от типа пришедшего сообщения
     * @param store
     * @param response
     * @param {WebSocket} socket
     * @param {string} username - юзер, с чьей стороны открыт сокет
     */
    static onResponse(store, response, socket, username) {
        const data = ws.parseMessage(response.data);
        const {type, status, payload} = data;

        let isOwn;
        let time;
        switch (type) {
            case responseTypeWS.createMessage:
                isOwn = payload.username === username;
                time = new Date(payload.time);
                store.EventBus.emit(store.Events.messageReceived, {
                    msg: payload.content,
                    time: time.getHours() + ':' + time.getMinutes(),
                    owner: isOwn
                })
                break;

            case responseTypeWS.getLastMessages:
            case responseTypeWS.getHistoryMessages:
                let list = [];
                payload.forEach((m) => {
                    const time = new Date(m.time);
                    list.push({
                        msg: m.content,
                        time: time.getHours() + ':' + time.getMinutes(),
                        owner: m.username === username,
                    })
                })
                store.EventBus.emit(store.Events.chatLastMessagesReceived, {list: list})
                break;

            case responseTypeWS.noteFollow:
                store.EventBus.emit(store.Events.follow, {})
                store.EventBus.emit(store.Events.addNotification, {})
                break;

            case responseTypeWS.notePin:
            case responseTypeWS.noteComment:
                store.EventBus.emit(store.Events.addNotification, {});
                break;

            case responseTypeWS.noteMessage:
                isOwn = payload.username === username;
                time = new Date(payload.time);
                store.EventBus.emit(store.Events.getNewMessage, {
                    chatId: payload.chat_id,
                    id: payload.chat_id,
                    msg: payload.content,
                    time: time.getHours() + ':' + time.getMinutes(),
                    last_msg_time: time.getHours() + ':' + time.getMinutes(),
                    owner: isOwn,
                    collocutor_ava: payload.avatar,
                    last_msg_content: payload.content,
                    collocutor_name: payload.username,
                })
                // store.EventBus.emit(store.Events.addNotification, {});
                break;

            default:
                console.log(data);
                break;
        }
    }


    /**
     * Парсит сообщение от бэка
     * @param message
     * @returns {{error: boolean}|{payload: *, type: *}}
     */
    static parseMessage(message) {
        let dataError = false;
        let data;
        try {
            data = JSON.parse(message);
        } catch (e) {
            dataError = true;
        }
        if (dataError) {
            return {error: true};
        }
        return {
            type: data.type,
            status: data.status,
            payload: JSON.parse(this.decodeB64(data.data)),
        };
    }

    static parseNotification(note) {
        let dataError = false;
        let data;
        console.log({
            type: note.type,
            time: new Date(note.creation_time),
            payload: this.decodeB64(note.data)
        })
    }

    static encodeUTF8(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    static decodeB64(str) {
        return decodeURIComponent(escape(atob(str)));
    }
}


//
//
// class Websocket extends Object {
//     socketPromise
//     socket
//
//     get newPromise() {
//         return new Promise(((resolve, reject) => {
//             this.socket = new WebSocket('ws://localhost:8008/ws');
//             this.socket.onopen = () => {
//                 console.log('WS connected');
//                 resolve(this.socket);
//             }
//             this.socket.onerror = (error) => {reject(error)};
//         }))
//     }
//
//     get Promise() {
//         if (!this.socketPromise) {
//             this.socketPromise = this.newPromise;
//         }
//         return this.socketPromise;
//     }
// }
//
// export default new Websocket();


//
// // socket.onopen = function(e) {
// //     alert("[open] Соединение установлено");
// //     alert("Отправляем данные на сервер");
// //     socket.send("Меня зовут Джон");
// // };
// //
// // socket.onmessage = function(event) {
// //     alert(`[message] Данные получены с сервера: ${event.data}`);
// // };
// //
// // socket.onclose = function(event) {
// //     if (event.wasClean) {
// //         alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
// //     } else {
// //         // например, сервер убил процесс или сеть недоступна
// //         // обычно в этом случае event.code 1006
// //         alert('[close] Соединение прервано');
// //     }
// // };
// //
// // socket.onerror = function(error) {
// //     alert(`[error] ${error.message}`);
// // };
//
