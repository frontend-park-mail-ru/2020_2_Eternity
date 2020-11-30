import BaseController from "./BaseController.js";
import MainPage from "../views/main/main.js";

import {fakePins} from "../modules/consts/fake.js"

import PinModel from "../models/PinModel";
import eventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";
import UserModel from "../models/UserModel";

export default class MainController extends BaseController {
    searchData = {}
    loadMoreLock

    constructor() {
        super(new MainPage());
    }

    on(data = {}) {
        this.loadMoreLock = true;
        eventBus.on(Events.feedNext, this.onFeedNext.bind(this));

        if (Object.keys(data).length) {
            this.searchData = data;
            PinModel.getAllSearchData(data).then((response) => {
                this.view.fillWith(data.type === 'user' ? {protoUsers: response} : {protoPins: response});
                this.view.render();

                if (response.length < 15) {
                    this.loadMoreLock = false;
                }
                this.view.fillEmptyPlace();
            }).catch((error) => console.log(error));
        } else {
            PinModel.getAllPins().then((response) => {
                this.view.fillWith({protoPins: response});
                this.view.render();

                if (response.length < 15) {
                    this.loadMoreLock = false;
                }
                this.view.fillEmptyPlace();
            }).catch((error) => console.log(error));
        }
        //this.view.fillWith({pins: fakePins});
        super.on();
    }

    off() {
        this.view.fillingMutex = true;
        // console.log(this.view.list);
        eventBus.off(Events.feedNext, this.onFeedNext.bind(this));
        this.view.list = [];
        this.view.users = [];
        this.searchData = {};
        // console.log(this.view.list);
        super.off();
    }

    onFeedNext(data = {}) {
        if (this.loadMoreLock) {
            if (Object.keys(this.searchData).length) {
                data['type'] = this.searchData.type;
                data['content'] = this.searchData.content;
                PinModel.getNextSearchData(data).then((response) => {
                    if (response.length < 15) {
                        this.loadMoreLock = false;
                    }

                    this.view.fillWith({protoPins: response});
                    this.view.render();
                    this.view.fillingMutex = true;
                    this.view.fillEmptyPlace();
                }).catch((error) => console.log(error));
            } else {
                PinModel.getNextFeedPins(data).then((response) => {
                    if (response.length < 15) {
                        this.loadMoreLock = false;
                    }

                    this.view.fillWith({protoPins: response});
                    this.view.render();
                    this.view.fillingMutex = true;
                    this.view.fillEmptyPlace();
                }).catch((error) => console.log(error));
            }
        }
    }
}