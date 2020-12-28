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
import {Icons} from "../modules/consts/icons";
import Boardbar from "../components/Boardbar/Boardbar";

export default class PinController extends BaseController {
    pressedKeys = {};

    constructor() {
        super(new PinPage());

        this.view.onAddComment = this.onPinComment.bind(this);
        this.view.onShowActionsDropdown = this.onShowActionsDropdown.bind(this);
        this.view.onShowShareDropdown = this.onShowShareDropdown.bind(this);
        this.view.onShowReportForm = this.onShowReportForm.bind(this);
        this.view.onSendReport = this.onSendReport.bind(this);
        this.view.onShare = this.onShare.bind(this);
        this.view.onAttachPin = this.onAttachPin.bind(this);
        this.view.onShowBoardDrop = this.onShowBoardDrop.bind(this);
        this.view.onShowCreateBoardPopup = this.onShowCreateBoardPopup.bind(this);
        this.view.onCreateBoardAndAttach = this.onCreateBoardAndAttach.bind(this);
        this.sendCommentOnEnter = this.sendCommentOnEnter.bind(this);
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
                            BoardModel.checkAttachingPin({pin_id: response.id}).then((checkingResponse) => {
                                let m = {};
                                if (checkingResponse.length !== 0) {
                                    checkingResponse.forEach((b) => {
                                        m[b.id] = b;
                                    })
                                }

                                let lastAttached = {count: 0};
                                boardResponse.forEach((board) => {
                                    if (!(board.id in m)) {
                                        board.type = 'remove';
                                        lastAttached.count++;
                                        lastAttached.board = board;
                                    } else {
                                        board.type = 'add'
                                    }
                                })
                                this.view.loadBoards(boardResponse, lastAttached);
                            })
                        });
                    }
                });

            } else {
                eventBus.emit(Events.pathChanged, routes.mainPage);
            }
        }).catch((error) => console.log(error));

        eventBus.on(Events.pinAttach, this.onPinAttach.bind(this));

        document.addEventListener('keydown', this.sendCommentOnEnter);

        document.addEventListener('keyup', (event) => {
            delete this.pressedKeys[event.key];
        });
    }

    off() {
        document.removeEventListener('click', this.view.boardDrop.listenerOnClose);
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

        if (this.view.dropdown) {
            if (this.view.dropdown.element) {
                this.view.dropdown.element.removeEventListener('change', this.view.onAttachPin);
            }
        }

        if (this.view.boardDrop) {
            if (this.view.boardDrop.element) {
                this.view.boardDrop.element.querySelector('.dropdown__label').removeEventListener('click', this.view.onShowBoardDrop);
            }
        }

        if (this.view.createBoardBtn) {
            this.view.createBoardBtn.removeEventListener('click', this.view.onCreateBoardAndAttach);
        }

        document.removeEventListener('keydown', this.sendCommentOnEnter);

        document.removeEventListener('keyup', (event) => {
            delete this.pressedKeys[event.key];
        });

        super.off();
    }

    sendCommentOnEnter(event) {
        this.pressedKeys[event.key] = true;

        if (event.key === 'Enter' && !this.pressedKeys['Shift'] && document.activeElement === document.getElementById('userComment')) {
            event.preventDefault();
            this.onPinComment();
        }
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
        if (event.target.closest('[data-activates]').getAttribute('data-activates') !== 'copy') {
            window.open(event.currentTarget.href, 'Поделиться', 'width=600, height=500, location=no, menubar=no, toolbar=no');
        } else {
            this.copyLink(event.target.closest('[data-activates]'));
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
        const origin = event.target.closest('.boardbar[data-act]');
        if (origin) {
            const data = {
                board_id: parseInt(origin.getAttribute('id')),
                pin_id: this.view.context.info.id,
            }
            if (origin.dataset.act === 'add') {
                BoardModel.attachPin(data).then((response) => {
                    if (!response.error) {
                        // CHANGE LABEL
                        if (this.view.boardDrop.countSaved === 0) {
                            this.view.boardDrop.showSaved();
                        } else {
                            this.view.boardDrop.setCountSaved(++this.view.boardDrop.countSaved)
                        }
                        this.view.boardDrop.setText(origin.querySelector('.boardbar__title').textContent)

                        // CHANGE BTN
                        origin.querySelector('.boardbar__btn').classList.add('boardbar__btn_active');
                        origin.querySelector('.btn').innerHTML = Icons.remove;

                        // CHANGE DATA
                        origin.setAttribute('data-act', 'remove');
                    }
                })
            } else {
                BoardModel.detachPin(data).then((r) => {
                    // CHANGE DATA
                    origin.setAttribute('data-act', 'add');

                    // CHANGE LABEL
                    this.view.boardDrop.decSaved();
                    if (this.view.boardDrop.countSaved === 0) {
                        this.view.boardDrop.setText('...');
                    } else {
                        const t = document.getElementById('listboardsWideDrop').querySelector('[data-act="remove"]')
                            .querySelector('.boardbar__title').textContent;
                        this.view.boardDrop.setText(t);
                    }

                    // CHANGE BTN
                    origin.querySelector('.boardbar__btn').classList.remove('boardbar__btn_active');
                    origin.querySelector('.btn').innerHTML = Icons.add;
                })
            }
        }
    }

    copyLink(e) {
        window.getSelection().selectAllChildren(document.getElementById('url-to-copy'));
        document.execCommand('copy');
        window.getSelection().removeAllRanges();

        const tmpIcon = e.innerHTML;
        e.innerHTML = Icons.checkMark;

        setTimeout(() => {
            e.innerHTML = tmpIcon;
        }, 1000);
    }

    onShowBoardDrop(event) {
        const drop = event.target.closest('.dropdown__wrap').querySelector('.dropdown__drop');
        if (drop) {
            if (this.view.boardDrop.isOpened) {
                this.view.boardDrop.hideDrop();
            } else {
                this.view.boardDrop.showDrop();
            }
        }
    }

    onShowCreateBoardPopup(event) {
        const origin = event.target.closest('[data-popup]');
        if (origin) {
            const targetSelector = origin.getAttribute('data-popup');
            this.view.createForm.origin = origin;
            this.view.createForm.open(targetSelector);
            this.view.boardDrop.hideDrop();
        }
    }

    onCreateBoardAndAttach(event) {
        const data = {
            title: this.view.createFormComponent.title.value,
            description: this.view.createFormComponent.description.value,
        }
        const pinId = parseInt(event.target.dataset.pinId);
        BoardModel.createBoard(data).then((responseBoard) => {
            if (!responseBoard.error) {
                BoardModel.attachPin({board_id: responseBoard.id, pin_id: pinId}).then((responseAttach) => {
                    if (!responseAttach.error) {
                        const nb = new Boardbar({...responseBoard, type: 'remove'});
                        this.view.boardDrop.list.addItem(nb);
                        if (this.view.boardDrop.countSaved === 0) {
                            this.view.boardDrop.showSaved();
                        } else {
                            this.view.boardDrop.setCountSaved(++this.view.boardDrop.countSaved)
                        }
                        this.view.boardDrop.setText(responseBoard.title);

                        nb.element.querySelector('.btn').addEventListener('click', this.view.onAttachPin);

                        this.view.createForm.close();
                        EventBus.emit(Events.showNotificationBar, {
                            type: 'success',
                            text: `Пин успешно прикреплен к новой доске ${responseBoard.title}`
                        })
                    }
                })
            }
        }).catch((error) => console.log(error))
    }
}