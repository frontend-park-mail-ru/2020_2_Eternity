import BaseController from "./BaseController.js";
import BoardPage from "../views/Board/Board.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import BoardModel from "../models/BoardModel.js";
import CommentModel from "../models/CommentModel";
import PinModel from "../models/PinModel";


export default class BoardController extends BaseController {
    constructor() {
        super(new BoardPage());
    }

    on(data={}) {
        BoardModel.getBoard(data).then((response) => {
            this.view.fillWith(response);

            PinModel.getBoardPins(data).then((pinsResponse) => {
                this.view.fillWith({pins: pinsResponse});
                this.view.render();
            })
        }).catch((error) => console.log(error));

        super.on();
    }
}