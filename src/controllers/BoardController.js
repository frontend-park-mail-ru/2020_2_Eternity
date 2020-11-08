import BaseController from "./BaseController.js";
import BoardPage from "../views/board/board.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import BoardModel from "../models/BoardModel.js";


export default class BoardController extends BaseController {
    constructor() {
        super(new BoardPage());
    }

    on(data={}) {
        BoardModel.getBoard(data).then((response) => {
            this.view.fillWith(response);
            this.view.render();
        }).catch((error) => console.log(error));

        super.on();
    }
}