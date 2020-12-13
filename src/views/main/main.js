import template from './main.hbs'

import BaseView from "../BaseView.js";

import Card from "../../components/Card/Card.js";
import Userbar from "../../components/Userbar/Userbar";
import List from "../../components/List/List";
import Popup from "../../components/Popup/Popup";

import eventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";

export default class MainPage extends BaseView {
    test

    popupPinView
    cards = []
    lastPin
    list = []
    listenerMutex
    fillingMutex
    users = []

    copyLinkBtns

    constructor(context = {}) {
        super('Главная', context, null);
        this.template = template;

        // this.test = new Dropdown({
        //     id: 'dropdown1',
        //     title: 'Доступные доски'
        // });

        /**
         * УБРАТЬ---------------------------------
         */
        const te = new Userbar({
            username: 'example',
            img_link: '/img/img11/.jpg',
        })
        this.test = new List({
            id: 'test',
        });
        this.test.addItem(te, "prepend");
        /**
         * ---------------------------------------
         */

        this.lastPin = 0;

        this.listenerMutex = true;
        this.fillingMutex = true;
    }

    fillEmptyPlace() {
        if ((window.innerHeight + document.getElementsByTagName("html")[0].scrollTop >=
            document.getElementsByClassName("content-grid")[0].clientHeight / 2) &&
            this.lastPin > 1 &&
            this.fillingMutex) {
            this.fillingMutex = false;
            eventBus.emit(Events.feedNext, {lastPin: this.lastPin});
        }
    }

    render() {
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

        if (this.context.protoPins) {
            this.context.protoPins.forEach((pin) => {
                const card = new Card(pin);
                this.cards.push(card);
                this.list.push(card.render());
                this.lastPin = pin.id;
            });
            this.context.protoPins = [];
        }

        const data = {
            pins: this.list,
            users: this.users,
            popup: this.popupPinView.render(),
            test: this.test.render()
        }

        this.fillWith(data);
        super.render();

        const cardWidth = 15 * parseFloat(getComputedStyle(document.documentElement).fontSize);

        this.cards.forEach((card) => {
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
        });

        if (document.getElementsByClassName("content-grid")[0] && this.listenerMutex) {
            this.listenerMutex = false;

            window.addEventListener('scroll', () => {
                console.log('WORK');
                this.fillEmptyPlace();
            });
        }


        this.copyLinkBtns = document.querySelectorAll('.copy-link');
        this.copyLinkBtns.forEach((btn) => {
            btn.addEventListener('click', this.onCopyLink);
        });
    }
}
