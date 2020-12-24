import BaseController from "./BaseController.js";

import MainPage from "../views/main/main.js";

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

        // this.view.onCopyLink = this.onCopyLink.bind(this);
        this.view.onShowCreateDropdown = this.onShowCreateDropdown.bind(this);
    }

    resize = () => {
        this.off();
        this.on();
    }

    on(data = {}) {
        this.loadMoreLock = true;
        eventBus.on(Events.feedNext, this.onFeedNext.bind(this));

        if (Object.keys(data).length) {
            this.searchData = data;

            if (data.type === 'user' || data.type === 'pin') {
                PinModel.getAllSearchData({type: data.type, content: data.content}).then((response) => {
                    this.view.fillWith(data.type === 'user' ? {protoUsers: response} : {protoPins: response});
                    this.view.render();

                    if (response.length < 15) {
                        this.loadMoreLock = false;
                    }
                    this.view.fillEmptyPlace();
                }).catch((error) => console.log(error));
            } else if (data.type === ':search') {
                console.log(data.type);

                PinModel.getAllSearchData({type: 'user', content: data.content}).then((response) => {
                    this.view.fillWith({protoUsers: response});
                    this.view.render();

                    if (response.length < 15) {
                        this.loadMoreLock = false;
                    }
                    this.view.fillEmptyPlace();
                }).catch((error) => console.log(error));

                PinModel.getAllSearchData({type: 'pin', content: data.content}).then((response) => {
                    this.view.fillWith({protoPins: response});
                    this.view.render();

                    if (response.length < 15) {
                        this.loadMoreLock = false;
                    }
                    this.view.fillEmptyPlace();
                }).catch((error) => console.log(error));
            }

/*            data.type = 'board';

            PinModel.getAllSearchData(data).then((response) => {
                this.view.fillWith(data.type === 'user' ? {protoUsers: response} : {protoPins: response});
                this.view.render();

                if (response.length < 15) {
                    this.loadMoreLock = false;
                }
                this.view.fillEmptyPlace();
            }).catch((error) => console.log(error));*/

        } else {
            if (window.location.pathname === '/following') {
                PinModel.getFeedPins().then((response) => {
                    // this.view.fillWith({protoPins: fakePins});
                    this.view.fillWith({protoPins: response});
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
        }

        super.on();
        window.addEventListener('resize', this.resize);
    }

    off() {
        // this.view.copyLinkBtns.forEach((btn) => {
        //     btn.removeEventListener('click', this.view.onCopyLink);
        // });

        if (this.view.btnCreate) {
            if (this.view.btnCreate.element) {
                this.view.btnCreate.element.removeEventListener('click', this.view.onShowCreateDropdown);
            }
        }

        this.view.fillingMutex = true;
        // console.log(this.view.list);
        eventBus.off(Events.feedNext, this.onFeedNext.bind(this));
        this.view.cards = [];
        this.view.lastPin = 0;
        this.view.list = [];
        this.view.users = [];
        this.searchData = {};
        this.view.matrix = [];
        this.view.left = 0;
        this.view.top = 0;
        this.view.currentIdx = 0;
        this.view.cardsInRow = 0;
        this.view.maxHeight = 0;
        // console.log(this.view.list);
        super.off();
        window.removeEventListener('resize', this.resize);
    }

    onFeedNext(data = {}) {
        if (this.loadMoreLock) {
            /*if (Object.keys(this.searchData).length) {
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
            } else {*/
                PinModel.getNextFeedPins(data).then((response) => {
                    if (response.length < 15) {
                        this.loadMoreLock = false;
                    }

                    this.view.fillWith({protoPins: response});
                    this.view.render();
                    this.view.fillingMutex = true;
                    this.view.fillEmptyPlace();
                }).catch((error) => console.log(error));
            // }
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

    onShowCreateDropdown(event) {
        const origin = event.target.closest('[data-activates]');
        if (origin) {
            const targetSelector = origin.getAttribute('data-activates');
            this.view.dropdownCreate.origin = origin;
            this.view.dropdownCreate.dropdown = document.getElementById(targetSelector);
            if (this.view.dropdownCreate.isOpened) {
                this.view.dropdownCreate.hide();
            } else {
                this.view.dropdownCreate.show();
            }
        }
    }
}
