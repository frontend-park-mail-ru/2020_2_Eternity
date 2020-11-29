import template from './main.hbs'

import BaseView from "../BaseView.js";

import Card from "../../components/Card/Card.js";
import Popup from "../../components/Popup/Popup.js";
import {fakePins} from "../../modules/consts/fake.js";


export default class MainPage extends BaseView {
    popupPinView
    card

    constructor(context = {}) {
        super('Главная', context, null);
        this.template = template;

        this.popupPinView = new Popup({
            id: 'pinView',
            content: 'hello, its me',
        });
        this.card = new Card();
    }


    render() {
        let list = [];

        this.context.pins = fakePins;

        if (this.context.pins) {
            this.context.pins.forEach((pin) => {
                this.card.context = pin;
                list.push(this.card.render());
            });
        }

        const data = {
            pins: list,
            popup: this.popupPinView.render(),
        }

        this.fillWith(data);
        super.render()
    }
}
