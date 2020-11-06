import BaseController from "./base_controller.js";
import PinPage from "../views/pin/pin.js";

import eventBus from "../modules/tools/eventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import PinModel from "../models/PinModel.js";

export default class PinController extends BaseController {
    constructor() {
        super(new PinPage());
    }

    on(data={}) {
        const pin = PinModel.getPin(data);
        this.view.fillWith(pin);
        super.on();
    }


}