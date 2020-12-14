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
import Navbar from "../components/Navbar/Navbar";

export default class PinController extends BaseController {
    constructor() {
        super(new PinPage());

        this.view.onAddComment = this.onPinComment.bind(this);
    }

    on(data={}) {
        PinModel.getPin(data).then((response) => {
            if (response) {
                this.view.context.auth = Navbar.context.isAuth;
                this.view.load(response)

                PinModel.getPinComments(data).then((commentsResponse) => {
                    if (commentsResponse) {
                        this.view.loadComments(commentsResponse);
                    }
                });

                this.view.context.show = false;

                UserModel.getProfile().then((profileResponse) => {
                    if (profileResponse) {
                        BoardModel.getUserBoards(profileResponse).then((boardResponse) => {
                            if (boardResponse) {
                                this.view.context.show = true;
                                this.view.fillWith({options: boardResponse});
                                // this.view.render();
                            }
                        });
                    }
                });

            } else {
                eventBus.emit(Events.pathChanged, routes.mainPage);
            }
        }).catch((error) => console.log(error));

        super.on();

        eventBus.on(Events.pinAttach, this.onPinAttach.bind(this));
    }

    off() {
        eventBus.off(Events.pinAttach, this.onPinAttach.bind(this));
        if (this.view.btnComment.element) {
            this.view.btnComment.element.removeEventListener('click', this.view.onAddComment);
        }
        super.off();
    }


    onPinComment() {
        this.view.userComment.checkValid();
        if (!this.view.userComment.hasError()) {
            const data = {
                is_root: true,
                content: this.view.userComment.value,
                pin_id: this.view.context.id,
            }
            CommentModel.createComment(data).then((response) => {
                if (!response.error) {
                    this.view.addCommentToList(response);
                }
            })
        }
    }

    onPinAttach(data={}) {
        BoardModel.attachPin(data).then((response) => {
            if (!response.error) {
                this.view.addCommentToList(response);
            }
        })
    }
}