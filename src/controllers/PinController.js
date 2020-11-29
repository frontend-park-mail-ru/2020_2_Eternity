import BaseController from "./BaseController.js";
import PinPage from "../views/Pin/Pin.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import PinModel from "../models/PinModel.js";
import CommentModel from "../models/CommentModel.js";
import EventBus from "../modules/tools/EventBus";
import UserModel from "../models/UserModel";
import BoardModel from "../models/BoardModel";
import Navbar from "../components/navbar/navbar";

export default class PinController extends BaseController {
    constructor() {
        super(new PinPage());
    }

    on(data={}) {
        PinModel.getPin(data).then((response) => {
            if (response) {
                this.view.context.auth = Navbar.context.isAuth;

                this.view.fillWith(response);
                this.view.render();

                PinModel.getPinComments(data).then((commentsResponse) => {
                    if (commentsResponse) {
                        this.view.fillWith({commentList: commentsResponse});
                        this.view.render();
                    }
                });

                this.view.context.show = false;

                UserModel.getProfile().then((profileResponse) => {
                    if (profileResponse) {
                        BoardModel.getUserBoards(profileResponse).then((boardResponse) => {
                            if (boardResponse) {
                                this.view.context.show = true;
                                this.view.fillWith({options: boardResponse});
                                this.view.render();
                            }
                        });
                    }
                });

            } else {
                eventBus.emit(Events.pathChanged, routes.mainPage);
            }
        }).catch((error) => console.log(error));

        super.on();

        eventBus.on(Events.pinComment, this.onPinComment.bind(this));
        eventBus.on(Events.pinAttach, this.onPinAttach.bind(this));
    }

    off() {
        eventBus.off(Events.pinComment, this.onPinComment.bind(this));
        eventBus.off(Events.pinAttach, this.onPinAttach.bind(this));

        super.off();
    }

    onPinComment(data={}) {
        CommentModel.createComment(data).then((response) => {
            if (!response.error) {
                this.view.addCommentToList(response);
            }
        })
    }

    onPinAttach(data={}) {
        BoardModel.attachPin(data).then((response) => {
            if (!response.error) {
                this.view.addCommentToList(response);
            }
        })
    }
}