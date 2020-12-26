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
import EventBus from "../modules/tools/EventBus.js";

export default class PinController extends BaseController {
    constructor() {
        super(new PinPage());

        this.view.onAddComment = this.onPinComment.bind(this);
        this.view.onShowActionsDropdown = this.onShowActionsDropdown.bind(this);
        this.view.onShowShareDropdown = this.onShowShareDropdown.bind(this);
        this.view.onShowReportForm = this.onShowReportForm.bind(this);
        this.view.onSendReport = this.onSendReport.bind(this);
        this.view.onShare = this.onShare.bind(this);
        this.view.onShowBoards = this.onShowBoards.bind(this);
        this.view.onAttachPin = this.onAttachPin.bind(this);
    }

    on(data = {}) {
        PinModel.getPin(data).then((response) => {
            if (response) {
                super.on();
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
                                this.view.loadBoards(boardResponse);
                            }
                        });
                    }
                });

            } else {
                eventBus.emit(Events.pathChanged, routes.mainPage);
            }
        }).catch((error) => console.log(error));

        eventBus.on(Events.pinAttach, this.onPinAttach.bind(this));
    }

    off() {
        eventBus.off(Events.pinAttach, this.onPinAttach.bind(this));
        if (this.view.btnComment) {
            if (this.view.btnComment.element) {
                this.view.btnComment.element.removeEventListener('click', this.view.onAddComment);
            }
        }

        if (this.view.btnAction) {
            if (this.view.btnAction.element) {
                this.view.btnAction.element.removeEventListener('click', this.view.onShowActionsDropdown);
            }
        }

        if (this.view.btnShare) {
            if (this.view.btnShare.element) {
                this.view.btnShare.element.removeEventListener('click', this.view.onShowShareDropdown);
            }
        }

        if (this.view.linkReport) {
            if (this.view.linkReport.element) {
                this.view.linkReport.element.removeEventListener('click', this.view.onShowReportForm);
            }
        }

        if (this.view.reportFormComponent) {
            if (this.view.reportFormComponent.btnReport) {
                if (this.view.reportFormComponent.btnReport.element) {
                    this.view.reportFormComponent.btnReport.element.removeEventListener('click', this.view.onSendReport);
                }
            }
        }

        if (this.view.btnBoard) {
            if (this.view.btnBoard.element) {
                this.view.btnBoard.element.removeEventListener('click', this.view.onShowBoards);
            }
        }

        if (this.view.dropdown) {
            if (this.view.dropdown.element) {
                this.view.dropdown.element.removeEventListener('change', this.view.onAttachPin);
            }
        }
        super.off();
    }


    onPinComment() {
        this.view.userComment.checkValid();
        if (!this.view.userComment.hasError()) {
            const data = {
                is_root: true,
                content: this.view.userComment.value,
                pin_id: this.view.context.info.id,
            }

            CommentModel.createComment(data).then((response) => {
                if (!response.error) {
                    this.view.addCommentToList(response);
                }
            })
        }
    }

    onPinAttach(data = {}) {
        BoardModel.attachPin(data).then((response) => {
            if (!response.error) {
                // this.view.addCommentToList(response);
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
                this.view.dropAction.show();
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
                this.view.dropShare.show();
            }
        }
    }

    onShare(event) {
        event.preventDefault();
        window.open(event.currentTarget.href, 'Поделиться', 'width=600, height=500, location=no, menubar=no, toolbar=no');
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

    onShowBoards(event) {
        const origin = event.target.closest('[data-activates]');
        if (origin) {
            const targetSelector = origin.getAttribute('data-activates');
            this.view.dropdown.origin = origin;
            this.view.dropdown.dropdown = document.getElementById(targetSelector);

            if (this.view.dropdown.isOpened) {
                this.view.dropdown.hide()
            } else {
                this.view.dropdown.show();
            }
        }
    }

    onAttachPin(event) {
        const origin = event.target;
        if (origin) {
            const data = {
                board_id: parseInt(origin.getAttribute('value')),
                pin_id: this.view.context.info.id,
            }
            EventBus.emit(Events.pinAttach, data);
        }
    }
}