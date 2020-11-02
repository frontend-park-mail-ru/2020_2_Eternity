import BaseController from "./base_controller.js";
import PinPage from "../views/pin/pin.js";

import eventBus from "../modules/tools/eventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import {fakePin} from "../modules/consts/fake.js"

// TODO: PinModel, PinRequests, +UserModel for author avatar
export default class PinController extends BaseController {
    constructor() {
        super(new PinPage());
    }

    on() {
        this.view.fillWith({...fakePin});
        this.view.render();
    }

    off() {
        this.view.clear();
    }
}