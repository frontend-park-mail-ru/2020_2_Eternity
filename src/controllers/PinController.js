import BaseController from "./BaseController.js";
import PinPage from "../views/pin/pin.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import PinModel from "../models/PinModel.js";
import CommentModel from "../models/CommentModel.js";
import EventBus from "../modules/tools/EventBus";

export default class PinController extends BaseController {
    constructor() {
        super(new PinPage());
    }

    on(data={}) {
        PinModel.getPin(data).then((response) => {
            if (response) {
                this.view.fillWith(response);
                this.view.render();

                PinModel.getPinComments(data).then((response) => {
                    if (response) {
                        this.view.fillWith({commentList: response.reverse()});
                        this.view.render();
                    }
                });

            } else {
                eventBus.emit(Events.pathChanged, routes.mainPage);
            }
        }).catch((error) => console.log(error));

        super.on();

        eventBus.on(Events.pinComment, this.onPinComment.bind(this));
    }

    onPinComment(data={}) {
        CommentModel.createComment(data).then((response) => {
            this.view.addCommentToList(response);
        })
    }
}