import BaseController from "./BaseController.js";
import BoardCreate from "../views/BoardCreate/BoardCreate.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import BoardModel from "../models/BoardModel.js";


export default class BoardCreateController extends BaseController {
    constructor() {
       super(new BoardCreate());
    }

    on() {
        eventBus.on(Events.boardCreating, this.onBoardCreating.bind(this));
        super.on();
    }

    off() {
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
}