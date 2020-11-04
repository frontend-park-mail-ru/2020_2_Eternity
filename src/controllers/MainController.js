import BaseController from "./base_controller.js";
import MainPage from "../views/main/main.js";

import {fakePins} from "../modules/consts/fake.js"

export default class MainController extends BaseController {
    constructor() {
        super(new MainPage());
    }

    on(data={}) {
        this.view.fillWith({pins: fakePins});
        super.on();
    }
}