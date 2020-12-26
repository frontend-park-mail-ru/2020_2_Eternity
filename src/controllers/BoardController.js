import BaseController from "./BaseController.js";
import BoardPage from "../views/Board/Board.js";

import BoardModel from "../models/BoardModel.js";
import PinModel from "../models/PinModel";


export default class BoardController extends BaseController {
    constructor() {
        super(new BoardPage());
    }

    on(data={}) {
        BoardModel.getBoard(data).then((response) => {
            this.view.fillWith(response);

            PinModel.getBoardPins(data).then((pinsResponse) => {
                response.pins = pinsResponse;
                this.view.fillWith({pins: pinsResponse});
                this.view.load(response);
            })
        }).catch((error) => console.log(error));

        super.on();
    }
}