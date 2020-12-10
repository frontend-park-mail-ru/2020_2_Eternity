import template from './main.hbs'

import BaseView from "../BaseView.js";

import Card from "../../components/Card/Card.js";
import Userbar from "../../components/Userbar/Userbar";
import List from "../../components/List/List";
import Dialog from "../../components/Dialog/Dialog";

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

    constructor(context = {}) {
        super('Главная', context, null);
        this.template = template;

        // this.card = new Card();
        // this.test = new Dropdown({
        //     id: 'dropdown1',
        //     title: 'Доступные доски'
        // });
        const te = new Userbar({
            username: 'example',
            img_link: '/img/img11/.jpg',
        })
        const tee = new Dialog({
            id: '1',
            username: 'testing2',
            text: 'abyrbalg',
            time: '11:21'
        })
        this.test = new List({
            id: 'test',
        });
        this.test.addItem(te, "prepend");
        this.test.addItem(tee, "append")

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
        if (this.context.protoUsers) {
            this.context.protoUsers.forEach((user) => {
               this.users.push(new Userbar(user).render());
            });

            this.context.protoUsers = [];   
        }

        if (this.context.protoPins) {
            this.context.protoPins.forEach((pin) => {
                let card = new Card(pin);
                this.cards.push(card);
                // this.card.context = pin;
                this.list.push(card.render());
                this.lastPin = pin.id;
            });

            this.context.protoPins = [];
        }

        const data = {
            pins: this.list,
            users: this.users,
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
    }
}
