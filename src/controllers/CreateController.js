import BaseController from "./BaseController.js";
import PinCreate from "../views/PinCreate/PinCreate.js";
import BoardCreate from "../views/BoardCreate/BoardCreate.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import PinModel from "../models/PinModel.js";
import BoardModel from "../models/BoardModel.js";


export default class CreateController extends BaseController {
    constructor(type) {
        if (type === 'pin') {
            super(new PinCreate());
        }
        if (type === 'board') {
            super(new BoardCreate());
        }
    }

    on() {
        eventBus.on(Events.pinCreating, this.onPinCreating.bind(this));
        eventBus.on(Events.boardCreating, this.onBoardCreating.bind(this));
        super.on();
    }

    off() {
        eventBus.off(Events.pinCreating, this.onPinCreating.bind(this));
        eventBus.off(Events.boardCreating, this.onBoardCreating.bind(this));
        super.off();
    }

    onBoardCreating(data = {}) {
        data.event.preventDefault();

        BoardModel.createBoard(data).then((response) => {
            if (!response.error) {
                console.log('new Board!')
                eventBus.emit(Events.pathChanged, routes.profilePage);
            }
        }).catch((error) => console.log(error))
    }

    onPinCreating(data = {}) {
        data.event.preventDefault();

        let formData = new FormData;
        formData.append('img', data.file);
        formData.append('data', JSON.stringify({
            title: data.title,
            content: data.description
        }));

        PinModel.createPin(formData).then((response) => {
            if (!response.error) {
                console.log('new Pin!')
                eventBus.emit(Events.pathChanged, routes.profilePage);
            }
        }).catch((error) => console.log(error))
    }
}