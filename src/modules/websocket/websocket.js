// const socket = new WebSocket('wss://localhost');


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
            ...data
        };
        socket.send(JSON.stringify(msg));
    }

    /**
     * Функция уведомляет бэк о том что отправлено сообщение
     * @param socket
     * @param text
     * @param owner
     */
    static sendMessage(socket, text, owner) {
        ws.sendCommand(socket, 'message', { text, owner })
    }

    /**
     * Подписка на приходящие сообщения
     * @param {WebSocket} socket
     * @param store - {инициатор событий (EventBus), событие (Events)}
     * @param {string} username - сторона, открывающая сокет
     */
    static on(socket, store, username) {
        socket.onmessage = (message) => {
            console.log(message);
            ws.onResponse(store, message, socket, username);
        }
    }

    /**
     * Поведение в зависимости от типа пришедшего сообщения на бэк
     * @param store
     * @param response
     * @param {WebSocket} socket
     * @param {string} username - юзер, с чьей стороны открыт сокет
     */
    static onResponse(store, response, socket, username) {
        const data = ws.parseMessage(response.data);
        console.log(data);
        const {type, payload} = data;

        switch (type) {
            case 'message': {
                const isOwn = payload.owner === username;
                // TODO: с бэка должно приходить вроде как
                let time = new Date;
                time = time.getHours() + ':' + time.getMinutes();
                store.EventBus.emit(store.Events.messageReceived, {msg: payload.text, time: time, owner: isOwn})
                // if (!ownMessage) {
                // sendNotification(`New Message from ${payload.userName}`, payload.text, chatIcon);
                // }
                break;
            }
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

        const {type} = data;
        delete data.type;
        return {
            type: type,
            payload: data,
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

