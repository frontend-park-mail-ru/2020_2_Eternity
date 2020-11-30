import BaseController from "./BaseController.js";
import MainPage from "../views/main/main.js";

import {fakePins} from "../modules/consts/fake.js"

import PinModel from "../models/PinModel";
import eventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import UserModel from "../models/UserModel";

export default class MainController extends BaseController {
    constructor() {
        super(new MainPage());
    }

    on(data={}) {
        eventBus.on(Events.feedNext, this.onFeedNext.bind(this));

        PinModel.getAllPins().then((response) => {
            this.view.fillWith({protoPins: response});
            this.view.render();
            this.view.fillEmptyPlace();
        }).catch((error) => console.log(error));
        //this.view.fillWith({pins: fakePins});
        super.on();
    }

    off() {
        // console.log(this.view.list);
        eventBus.off(Events.feedNext, this.onFeedNext.bind(this));
        this.view.list = [];
        // console.log(this.view.list);
        super.off();
    }

    onFeedNext(data = {}) {
        PinModel.getNextFeedPins(data).then((response) => {
            this.view.fillWith({protoPins: response});
            this.view.render();
            this.view.fillingMutex = true;
            this.view.fillEmptyPlace();
        }).catch((error) => console.log(error));
    }
}