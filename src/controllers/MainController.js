import BaseController from "./BaseController.js";

import MainPage from "../views/main/main.js";
import PinPopup from "../views/PopupViews/PinPopup/PinPopup";

import {fakePins} from "../modules/consts/fake.js"
import {Icons} from "../modules/consts/icons";

import PinModel from "../models/PinModel";
import UserModel from "../models/UserModel";

import eventBus from "../modules/tools/EventBus";
import {Events} from "../modules/consts/events";

export default class MainController extends BaseController {
    searchData = {}
    loadMoreLock

    constructor() {
        super(new MainPage());

        this.view.onShowPinPopupView = this.onShowPinPopupView.bind(this);
        this.view.onCopyLink = this.onCopyLink.bind(this);
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
                // this.view.fillWith({protoPins: fakePins});
                this.view.fillWith({protoPins: response});
                this.view.render();

                if (response.length < 15) {
                    this.loadMoreLock = false;
                }
                this.view.fillEmptyPlace();
            }).catch((error) => console.log(error));
        }

        super.on();
    }

    off() {
        this.view.popupPinView.close();
        this.view.cardLinks.forEach((card) => {
            card.removeEventListener('click', this.view.onShowPinPopupView);
        });
        this.view.copyLinkBtns.forEach((btn) => {
            btn.removeEventListener('click', this.view.onCopyLink);
        });

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


    onShowPinPopupView(event) {
        if (!event.target.closest('[data-activates]') && !event.target.closest('[data-copy]')) {
            const origin = event.target.closest('[data-popup]');
            if (origin) {
                const targetSelector = origin.getAttribute('data-popup');
                this.view.popupPinView.origin = origin;
                this.view.popupPinView.clearContent();
                this.view.popupPinView.open(targetSelector);

                const id = origin.getAttribute('href').replace('/pin/', '');
                PinModel.getPin({pin: id}).then((r) => {
                    const popupView = new PinPopup(r);
                    this.view.popupPinView.formContent(popupView.render())
                })
            }
        }
    }

    onCopyLink(event) {
        const origin = event.target.closest('[data-copy]');
        if (origin) {
            const range = document.createRange();
            range.selectNode(origin.querySelector('.btn__ext'));
            window.getSelection().addRange(range)
            try {
                document.execCommand('copy');

                const tmp = origin.firstElementChild;
                const template = document.createElement('template');
                template.innerHTML = Icons.checkMark.trim();
                origin.replaceChild(template.content.firstChild, tmp);
                origin.classList.add('fade-in_icon');

                this.onRemoveAnimation = this.removeAnimation.bind(this, origin, tmp);
                document.addEventListener('animationend', this.onRemoveAnimation);
            } catch (e) {
                console.log('oops')
            }
            window.getSelection().removeAllRanges();
        }
    }

    removeAnimation(origin, tmp) {
        origin.classList.remove('fade-in_icon');
        origin.replaceChild(tmp, origin.firstElementChild);
        document.removeEventListener('animationend', this.onRemoveAnimation);
    }
}