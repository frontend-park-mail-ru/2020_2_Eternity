import EventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";

export default class BaseController {
    view

    constructor(view) {
        this.view = view;
    }

    on(query, note) {
        this.view.render();
        if (note) {
            EventBus.emit(Events.showNotificationBar, {type: note.type, text: note.text});
        }
    }
    off(){
        this.view.clear();
    }
}