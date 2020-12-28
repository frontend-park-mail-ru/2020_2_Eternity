import template from './main.hbs'

import BaseView from "../BaseView.js";

import Card from "../../components/Card/Card.js";
import Userbar from "../../components/Userbar/Userbar";
import List from "../../components/List/List";
import Popup from "../../components/Popup/Popup";

import eventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";
import Button from "../../components/Button/Button";
import {Icons} from "../../modules/consts/icons";
import Dropdown from "../../components/Dropdown/Dropdown";
import Link from "../../components/Link/Link";
import Navbar from "../../components/Navbar/Navbar";

import PinModel from "../../models/PinModel";
import FollowOfferForm from "../../components/FollowOfferForm/FollowOfferForm";
import EventBus from "../../modules/tools/EventBus";

export default class MainPage extends BaseView {
    cards = []
    lastPin
    list = []
    listenerMutex
    fillingMutex
    users = []
    left
    top
    width
    matrix = []
    currentIdx;
    cardsInRow;
    maxHeight;

    copyLinkBtns

    popupOffer
    popupOfferComponent
    dropdownCreate
    btnCreate

    currentVirtualIndexTop = 1;
    previousVirtualIndexTop = 0;

    currentVirtualHeightTop = 0;
    previousVirtualHeightTop = 0;

    currentVirtualIndexBottom = 0;
    previousVirtualIndexBottom = 0;

    currentVirtualHeightBottom = 0;
    previousVirtualHeightBottom = 0;

    constructor(context = {}) {
        super('Главная', context, null);
        this.width = window.innerWidth;
        this.template = template;
        this.left = 0;
        this.top = 0;
        this.currentIdx = 0;
        this.cardsInRow = 0;
        this.maxHeight = 0;

        this.lastPin = 0;

        this.listenerMutex = true;
        this.fillingMutex = true;
    }

    debounce(func, ms) {
        let timeout;

        return function () {
            let self = this;
            const functionCall = function () {
                return func.apply(self, arguments);
            };
            clearTimeout(timeout);
            timeout = setTimeout(functionCall, ms);
        }
    }

    fillEmptyPlace() {
        if ((window.innerHeight + document.getElementsByTagName("html")[0].scrollTop >=
            this.maxHeight /*+ 300*/) &&
            this.lastPin > 1 &&
            this.fillingMutex) {
            this.fillingMutex = false;
            eventBus.emit(Events.feedNext, {lastPin: this.lastPin});
        }
    }

    setVirtualizeMax() {
        if (this.currentVirtualIndexTop !== this.previousVirtualIndexTop) {
            if (this.matrix.length > this.currentVirtualIndexTop) {
                this.currentVirtualHeightTop = Math.max(...this.matrix[this.currentVirtualIndexTop].map((elem) => elem.h));
                this.previousVirtualIndexTop = this.currentVirtualIndexTop;
            }
        }
    }

    setVirtualizeMin() {
        if (this.currentVirtualIndexBottom === 0) {
            for (let i = this.matrix.length - 1; i > 1; --i) {
                this.currentVirtualIndexBottom = i;
                if (Math.min(...this.matrix[i].map((elem) => elem.h - elem.c.context.height)) < window.innerHeight + document.getElementsByTagName("html")[0].scrollTop) {
                    this.currentVirtualIndexBottom++;
                    break;
                }
            }
        }

        if (this.currentVirtualIndexBottom !== this.previousVirtualIndexBottom) {
            if (this.matrix.length > 0) {
                this.currentVirtualHeightBottom = Math.min(...this.matrix[this.currentVirtualIndexBottom].map((elem) => elem.h - elem.c.context.height));
                this.previousVirtualIndexBottom = this.currentVirtualIndexBottom;
            }
        }

        // console.log([this.currentVirtualIndexBottom, this.currentVirtualHeightBottom])
    }

    checkIfOut() {
        this.setVirtualizeMax();
        this.setVirtualizeMin();

        if (this.currentVirtualIndexBottom > 0 && window.innerHeight + document.getElementsByTagName("html")[0].scrollTop < this.currentVirtualHeightBottom - 200) {
            // console.log(window.innerHeight + document.getElementsByTagName("html")[0].scrollTop)
            for (let mLen = this.matrix.length - 1; mLen >= this.currentVirtualIndexBottom; mLen--) {
                this.matrix[mLen].forEach((elem) => {
                    let domElem = document.getElementById(`pin${elem.c.context.id}`);
                    if (domElem) {
                        domElem.parentElement.removeChild(domElem);
                        this.list.pop();
                    }
                })
            }
            this.previousVirtualHeightBottom = this.currentVirtualHeightBottom;
            this.currentVirtualIndexBottom--;

            // console.log(this.previousVirtualHeightBottom);
        }

        if (this.currentVirtualIndexBottom > 0 && this.currentVirtualIndexBottom < this.matrix.length - 1 && window.innerHeight + document.getElementsByTagName("html")[0].scrollTop > this.previousVirtualHeightBottom) {
            let pins = document.createDocumentFragment();

            this.matrix[this.currentVirtualIndexBottom + 1].forEach((elem) => {
                let renderedElem = elem.c.render();
                let template = document.createElement('template');
                template.innerHTML = renderedElem;
                template = template.content.firstChild;

                pins.appendChild(template);

                this.list.push(renderedElem);
            })

            document.querySelector('.content-grid').appendChild(pins);

            this.currentVirtualIndexBottom++;
            // console.log([window.innerHeight + document.getElementsByTagName("html")[0].scrollTop, this.currentVirtualHeightBottom, this.currentVirtualIndexBottom])
        }


        if (this.currentVirtualIndexTop > 0 && document.getElementsByTagName("html")[0].scrollTop > this.currentVirtualHeightTop + 100) {
            this.matrix[this.currentVirtualIndexTop].forEach((elem) => {
                let domElem = document.getElementById(`pin${elem.c.context.id}`);
                domElem.parentElement.removeChild(domElem);
                this.list.shift();
                this.previousVirtualHeightTop = this.currentVirtualHeightTop;
            })
            this.currentVirtualIndexTop++;
        }

        if (this.currentVirtualIndexTop > 1 && document.getElementsByTagName("html")[0].scrollTop < this.previousVirtualHeightTop - 50) {
            let pins = document.createDocumentFragment();

            this.matrix[this.currentVirtualIndexTop - 1].forEach((elem) => {
                let renderedElem = elem.c.render();
                let template = document.createElement('template');
                template.innerHTML = renderedElem;
                template = template.content.firstChild;

                pins.appendChild(template);

                this.list.unshift(renderedElem);
            })

            document.querySelector('.content-grid').insertBefore(pins, document.querySelector('.content-grid').firstChild);

            this.currentVirtualIndexTop--;
        }

        // console.log(this.currentVirtualIndexTop)
    }

    render() {
        // console.log(window.innerHeight + document.getElementsByTagName("html")[0].scrollTop)

        this.width = document.getElementById('app').offsetWidth;

        const cardWidth = 15 * parseFloat(getComputedStyle(document.documentElement).fontSize);
        let cardNumber = Math.floor(this.width / cardWidth);
        let indent = (this.width - (cardNumber * cardWidth)) / cardNumber;

        if (cardNumber <= 1) {
            cardNumber = 1;
            indent = 0;
        } else if (indent <= 10) {
            cardNumber--;
            indent = (this.width - (cardNumber * cardWidth)) / cardNumber;
        }

        if (indent >= 40) {
            indent = 40;
            // this.left = (this.width - ((cardWidth + indent) * cardNumber) - indent) / 2;
        }

        // console.log(indent);

        if (this.left === 0) {
            this.left = (this.width - ((cardWidth + indent) * cardNumber) + indent) / 2;
        }

        if (this.matrix.length === 0) {
            this.matrix.push([]);
            for (let i = 0; i < cardNumber; ++i) {
                this.matrix[0].push({h: 0, c: null});
            }
        }

        if (this.context.protoUsers) {
            this.context.protoUsers.forEach((user) => {
                this.users.push(new Userbar(user).render());
            });

            this.context.protoUsers = [];
        }
        /*
                if (this.context.protoBoards) {
                    this.context.protoBoards.forEach((user) => {
                        this.users.push(new Userbar(user).render());
                    });

                    this.context.protoBoards = [];
                }*/

        if (!localStorage.getItem('authImg')) {
            if (this.context.protoPins) {
                let idx = Math.floor(Math.random() * Math.floor(15));
                if (this.context.protoPins[idx]) {
                    localStorage.setItem('authImg', this.context.protoPins[idx].img_link);
                    localStorage.setItem('authImgLink', `/pin/${this.context.protoPins[idx].id}`);

                    PinModel.getPin({pin: this.context.protoPins[idx].id}).then((response) => {
                        // console.log(response);
                        localStorage.setItem('authImgAuthor', response.username);
                        localStorage.setItem('authImgAuthorAvatar', response.avatar);
                    });
                }
            }
        }

        if (this.context.protoPins) {
            if ((this.cardsInRow === 0 || this.cardsInRow === cardNumber) && this.matrix.length < 2) {
                this.matrix.push([]);
                this.currentIdx++;
                this.cardsInRow = 0;
            }
            this.context.protoPins.forEach((pin) => {
                pin.pleft = this.left;

                pin.ptop = this.matrix[this.currentIdx - 1][this.cardsInRow].h;
                this.left += cardWidth + indent;

                const card = new Card(pin);

                this.cards.push(card);
                this.list.push(card.render());
                this.lastPin = pin.id;

                this.matrix[this.currentIdx].push({
                    h: (pin.title ? card.context.height + 25 : card.context.height) + 15 + this.matrix[this.currentIdx - 1][this.cardsInRow].h,
                    c: card
                });
                this.cardsInRow++;

                if (this.cardsInRow === cardNumber) {
                    this.matrix.push([]);
                    this.currentIdx++;
                    this.left = (this.width - ((cardWidth + indent) * cardNumber) + indent) / 2;
                    this.cardsInRow = 0;
                }
            });
            this.context.protoPins = [];
        }
        if (this.currentIdx && this.currentIdx > 0) {
            this.maxHeight = Math.min(...this.matrix[this.currentIdx - 1].map((elem) => elem.h));
        }
        // console.log(this.maxHeight);
        //
        // console.log(this.matrix);

        this.dropdownCreate = new Dropdown({
            id: 'dropdownCreate',
            custom: 'create__dropdown'
        })

        this.popupOffer = new Popup({
            id: 'followOfferPopup',
        })
        this.popupOfferComponent = new FollowOfferForm({
            id: 'followOfferForm',
        })

        let data = {
            pins: this.list,
            users: this.users,
            popup: this.popupOffer.render(),
        }

        if (Navbar.context.isAuth) {
            this.btnCreate = new Button({
                id: 'btnCreate',
                text: Icons.add,
                dataAttr: 'data-activates="' + this.dropdownCreate.context.id + '"',
                customButton: 'btn_round btn_with-icon create btn_green',
            })

            this.dropdownCreate.addToContent(new Link({href: '/create-pin', text: 'Пин', custom: 'create__link'}));
            this.dropdownCreate.addToContent(new Link({href: '/create-board', text: 'Доска', custom: 'create__link'}))

            data = {
                ...data,
                dropdownCreate: this.dropdownCreate.render(),
                btnCreate: this.btnCreate.render(),
            }
        }

        this.fillWith(data);
        super.render();

        /*this.cards.forEach((card) => {
            let pin = document.getElementById(`pin${card.context.id}`);
            let poll = setInterval(function () {
                if (pin) {
                    clearInterval(poll);
                    let height = pin.naturalHeight / (pin.naturalWidth / cardWidth);
                    pin.setAttribute('style', `min-height: ${height}`);
                }
            }, 10);
            if (pin) {
                pin.onload = () => {
                    pin.style.removeProperty('min-height')
                }
            }
        });*/

        if (document.getElementsByClassName("content-grid")[0] && this.listenerMutex) {
            this.listenerMutex = false;

            /*window.addEventListener('scroll', () => {
                // console.log('WORK');
                this.fillEmptyPlace();
            });*/

            window.addEventListener('scroll', this.debounce(() => this.fillEmptyPlace(), 100));
            window.addEventListener('scroll', this.debounce(() => this.checkIfOut(), 16));
        }

        // console.log(this.matrix);

        // this.copyLinkBtns = document.querySelectorAll('.copy-link');
        // this.copyLinkBtns.forEach((btn) => {
        //     btn.addEventListener('click', this.onCopyLink);
        // });

        if (Navbar.context.isAuth) {
            this.btnCreate.element.addEventListener('click', this.onShowCreateDropdown);
        }
        if (this.popupOffer.element.querySelector('.modal-window__close')) {
            this.popupOffer.element.querySelector('.modal-window__close').addEventListener('click', this.getBackOnCloseOffer)
        }
    }


}
