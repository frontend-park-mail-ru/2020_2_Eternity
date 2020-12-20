import BaseController from "./BaseController.js";
import PinPage from "../views/Pin/Pin.js";

import eventBus from "../modules/tools/EventBus.js";
import {Events} from "../modules/consts/events.js";
import {routes} from "../modules/consts/routes.js";

import PinModel from "../models/PinModel.js";
import CommentModel from "../models/CommentModel.js";
import UserModel from "../models/UserModel";
import BoardModel from "../models/BoardModel";
import Request from "../modules/request/Request";

import Navbar from "../components/Navbar/Navbar";

export default class PinController extends BaseController {
    constructor() {
        super(new PinPage());

        this.view.onAddComment = this.onPinComment.bind(this);
        this.view.onShowActionsDropdown = this.onShowActionsDropdown.bind(this);
        this.view.onShowShareDropdown = this.onShowShareDropdown.bind(this);
        this.view.onShowReportForm = this.onShowReportForm.bind(this);
        this.view.onSendReport = this.onSendReport.bind(this);
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
        if (this.view.btnComment) {
            this.view.btnComment.element.removeEventListener('click', this.view.onAddComment);
        }
        this.view.btnAction.element.removeEventListener('click', this.view.onShowActionsDropdown);
        this.view.btnShare.element.removeEventListener('click', this.view.onShowShareDropdown);
        this.view.linkReport.element.removeEventListener('click', this.view.onShowReportForm);
        this.view.reportFormComponent.btnReport.element.removeEventListener('click', this.view.onSendReport);
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

    onShowActionsDropdown(event) {
        const origin = event.target.closest('[data-activates]');
        if (origin) {
            const targetSelector = origin.getAttribute('data-activates');
            this.view.dropAction.origin = origin;
            this.view.dropAction.dropdown = document.getElementById(targetSelector);

            if (this.view.dropAction.isOpened) {
                this.view.dropAction.hide()
            } else {
                UserModel.getNotifications().then((r) => {
                    this.view.dropAction.show();
                })
            }
        }
    }

    onShowReportForm(event) {
        const origin = event.target.closest('[data-popup]');
        if (origin) {
            const targetSelector = origin.getAttribute('data-popup');
            this.view.reportForm.origin = origin;
            this.view.reportForm.open(targetSelector);
            this.view.dropAction.hide();
        }
    }

    onShowShareDropdown(event) {
        const origin = event.target.closest('[data-activates]');
        if (origin) {
            const targetSelector = origin.getAttribute('data-activates');
            this.view.dropShare.origin = origin;
            this.view.dropShare.dropdown = document.getElementById(targetSelector);

            if (this.view.dropShare.isOpened) {
                this.view.dropShare.hide()
            } else {
                UserModel.getNotifications().then((r) => {
                    this.view.dropShare.show();
                })
            }
        }
    }

    onSendReport() {
        const types = this.view.reportFormComponent.getCheckedProblems();
        let data = {
            message: this.view.reportFormComponent.description.value,
            pin_id: this.view.context.info.id,
            pin_owner: this.view.context.info.user_id,
        }
        types.forEach((typeRep) => {
            data = {
                ...data,
                type: parseInt(typeRep),
            }
            Request.sendReport(data).then((r) => {
                console.log('Ваше мнение очень важно для нас');
            }).catch((error) => console.log(error));
        })
        this.view.reportForm.close();
    }
}