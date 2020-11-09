import BaseController from "./BaseController.js";
import MainPage from "../views/main/main.js";

import {fakePins} from "../modules/consts/fake.js"

import PinModel from "../models/PinModel";

export default class MainController extends BaseController {
    constructor() {
        super(new MainPage());
    }

    on(data={}) {
        PinModel.getAllPins().then((response) => {
            this.view.fillWith({pins: response});
            this.view.render();
        }).catch((error) => console.log(error));
        //this.view.fillWith({pins: fakePins});
        super.on();
    }
}