class EventBus {
    listeners

    constructor() {
        this.listeners = {};
    }

    on(event, callback) {
        if (!(event in this.listeners)) {
            this.listeners[event] = [];
        }
        this.listeners[event].push(callback);
    }

    off(event, callback) {
        if (this.listeners[event]) {
            this.listeners[event] = this.listeners[event].filter((listener) => listener !== callback);
        }
    }

    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach((listener) => listener(data));
        }
        return this;
    }

    get listeners() {
        return this.listeners;
    }
}


export default new EventBus();
