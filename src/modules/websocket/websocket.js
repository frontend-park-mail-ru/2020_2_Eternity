import {requestTypeWS, responseTypeWS} from "./messageTypes";

export default class ws {
    /**
     * Базовая функция для отсылки сообщений разных типов на сервер (уведомление о подписке, сообщение, отписка, лайк и тд)
     * @param {WebSocket} socket
     * @param {string} method - type
     * @param data
     */
    static sendCommand(socket, method, data={}) {
        const msg = {
            type: method,
            data: this.encodeUTF8(JSON.stringify(data)),
        };
        socket.send(JSON.stringify(msg));
    }
    static encodeUTF8(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }
    static decodeB64(str) {
        return decodeURIComponent(escape(atob(str)));
    }

    /**
     * Функция уведомляет бэк о том что отправлено сообщение
     * @param socket
     * @param chatId
     * @param text
     */
    static sendMessage(socket, chatId, text) {
        ws.sendCommand(socket, requestTypeWS.createMessage, {chat_id: chatId, content: text});
    }
    static sendGetLastMessages(socket, chatId, num=15) {
        ws.sendCommand(socket, requestTypeWS.getLastMessages, {chat_id: chatId, n_messages: num,})
    }
    static sendGetHistoryMessages(socket, chatId, num = 15, lastMessageId) {
        ws.sendCommand(socket, requestTypeWS.getHistoryMessages, {
            chat_id: chatId,
            messages: num,
            message_id: lastMessageId
        });
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
     * Поведение в зависимости от типа пришедшего сообщения
     * @param store
     * @param response
     * @param {WebSocket} socket
     * @param {string} username - юзер, с чьей стороны открыт сокет
     */
    static onResponse(store, response, socket, username) {
        const data = ws.parseMessage(response.data);
        const {type, status, payload} = data;
        console.log(data)
        switch (type) {
            case responseTypeWS.createMessage: {
                const isOwn = payload.username === username;
                let time = new Date(payload.time);
                console.log(payload)
                store.EventBus.emit(store.Events.messageReceived, {
                    msg: payload.content,
                    time: time.getHours() + ':' + time.getMinutes(),
                    owner: isOwn
                })
            }
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
}





// socket.onopen = function(e) {
//     alert("[open] Соединение установлено");
//     alert("Отправляем данные на сервер");
//     socket.send("Меня зовут Джон");
// };
//
// socket.onmessage = function(event) {
//     alert(`[message] Данные получены с сервера: ${event.data}`);
// };
//
// socket.onclose = function(event) {
//     if (event.wasClean) {
//         alert(`[close] Соединение закрыто чисто, код=${event.code} причина=${event.reason}`);
//     } else {
//         // например, сервер убил процесс или сеть недоступна
//         // обычно в этом случае event.code 1006
//         alert('[close] Соединение прервано');
//     }
// };
//
// socket.onerror = function(error) {
//     alert(`[error] ${error.message}`);
// };

