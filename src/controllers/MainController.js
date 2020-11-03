import BaseController from "./base_controller.js";
import MainPage from "../views/main/main.js";

import {fakePins} from "../modules/consts/fake.js"

export default class MainController extends BaseController {
    constructor() {
        super(new MainPage());
    }

    on() {
        this.view.fillWith({pins: fakePins});
        this.view.render();
    }

    off() {
        this.view.clear();
    }
}