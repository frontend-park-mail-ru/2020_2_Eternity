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

export default class MainPage extends BaseView {
    test

    popupPinView
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

    dropdownCreate
    btnCreate

    constructor(context = {}) {
        super('Главная', context, null);
        this.width = window.innerWidth;
        this.template = template;
        this.left = 0;
        this.top = 0;
        this.currentIdx = 0;
        this.cardsInRow = 0;
        this.maxHeight = 0;

        // this.test = new Dropdown({
        //     id: 'dropdown1',
        //     title: 'Доступные доски'
        // });
/*

        /!**
         * УБРАТЬ---------------------------------
         *!/
        const te = new Userbar({
            username: 'example',
            img_link: '/img/img11/.jpg',
        })
        this.test = new List({
            id: 'test',
        });
        this.test.addItem(te, "prepend");
        /!**
         * ---------------------------------------
         *!/
*/

        this.lastPin = 0;

        this.listenerMutex = true;
        this.fillingMutex = true;
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

    render() {
        console.log(window.innerHeight + document.getElementsByTagName("html")[0].scrollTop)

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

        console.log(indent);

        if (this.left === 0) {
            this.left = (this.width - ((cardWidth + indent) * cardNumber) + indent) / 2;
        }

        if (this.matrix.length === 0) {
            this.matrix.push([]);
            for (let i = 0; i < cardNumber; ++i) {
                this.matrix[0].push(0);
            }
        }

        this.popupPinView = new Popup({
            id: 'pinView',
            custom: 'pin__view',
        })

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

        if (this.context.protoPins) {
            if ((this.cardsInRow === 0 || this.cardsInRow === cardNumber) && this.matrix.length < 2) {
                this.matrix.push([]);
                this.currentIdx++;
                this.cardsInRow = 0;
            }
            this.context.protoPins.forEach((pin) => {
                pin.pleft = this.left;

                pin.ptop = this.matrix[this.currentIdx - 1][this.cardsInRow];
                this.left += cardWidth + indent;

                const card = new Card(pin);

                this.cards.push(card);
                this.list.push(card.render());
                this.lastPin = pin.id;

                this.matrix[this.currentIdx].push((pin.title ? card.context.height + 25 : card.context.height) + 15 + this.matrix[this.currentIdx - 1][this.cardsInRow]);
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
            this.maxHeight = Math.min(...this.matrix[this.currentIdx - 1])
        }
        // console.log(this.maxHeight);
        //
        // console.log(this.matrix);

        this.dropdownCreate = new Dropdown({
            id: 'dropdownCreate',
            custom: 'create__dropdown'
        })
        this.btnCreate = new Button({
            id: 'btnCreate',
            text: Icons.add,
            dataAttr: 'data-activates="' + this.dropdownCreate.context.id + '"',
            customButton: 'btn_round btn_with-icon create btn_green',
        })
        this.dropdownCreate.addToContent(new Link({href: '/create-pin', text: 'Пин', custom: 'create__link'}));
        this.dropdownCreate.addToContent(new Link({href: '/create-board', text: 'Доска', custom: 'create__link'}))


        const data = {
            pins: this.list,
            users: this.users,
            popup: this.popupPinView.render(),
            // test: this.test.render(),
            dropdownCreate: this.dropdownCreate.render(),
            btnCreate: this.btnCreate.render()
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

            window.addEventListener('scroll', () => {
                // console.log('WORK');
                this.fillEmptyPlace();
            });
        }


        // this.copyLinkBtns = document.querySelectorAll('.copy-link');
        // this.copyLinkBtns.forEach((btn) => {
        //     btn.addEventListener('click', this.onCopyLink);
        // });
        this.btnCreate.element.addEventListener('click', this.onShowCreateDropdown);
    }
}
