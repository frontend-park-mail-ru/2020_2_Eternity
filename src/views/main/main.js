import template from './main.hbs'

import BaseView from "../BaseView.js";

import Card from "../../components/Card/Card.js";
import Popup from "../../components/Popup/Popup.js";
import {fakePins} from "../../modules/consts/fake.js";
import FileUpload from "../../components/FileUpload/FileUpload.js";
import Input from "../../components/Input-NEEDRENAME/Input.js";
import Validator from "../../modules/tools/Validator";
import Dropdown from "../../components/Dropdown/Dropdown";
import Textarea from "../../components/Textarea-NEEDRENAME/Textarea.js";
import Toggle from "../../components/Toggle-NEEDRENAME/Toggle";
import LabeledToggle from "../../components/Toggle-NEEDRENAME/LabeledToggle/LabeledToggle";
import EventBus from "../../modules/tools/EventBus";
import {Events} from "../../modules/consts/events";
import Button from "../../components/Button-NEEDRENAME/Button";
import {Icons} from "../../modules/consts/icons";
import Checkbox from "../../components/Checkbox/Checkbox";

import eventBus from "../../modules/tools/EventBus";
import Search from "../../components/Search/Search";


export default class MainPage extends BaseView {
    popupPinView
    cards = []
    lastPin
    list = []
    listenerMutex
    fillingMutex

    constructor(context = {}) {
        super('Главная', context, null);
        this.template = template;

        this.popupPinView = new Popup({
            id: 'pinView',
            content: 'hello, its me',
        });

        // this.card = new Card();
        this.test = new Dropdown({
            id: 'dropdown1',
            title: 'fsdsfsdfsd'
        });
        this.test = new Search({
            placeholder: '@пользователь или название'
        });

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
            pin.onload = () => {
                pin.style.removeProperty('min-height')
            }
        });

        if (document.getElementsByClassName("content-grid")[0] && this.listenerMutex) {
            this.listenerMutex = false;

            window.addEventListener('scroll', () => {
                this.fillEmptyPlace();
            });
        }
    }
}
