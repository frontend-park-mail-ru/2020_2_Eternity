import template from './main.hbs'

import BaseView from "../BaseView.js";

import Card from "../../components/card/card.js";
import Popup from "../../components/Popup/Popup.js";
import {fakePins} from "../../modules/consts/fake.js";


export default class MainPage extends BaseView {
    popupPinView

    constructor(context = {}) {
        super('Главная', context, null);
        this.template = template;

        this.popupPinView = new Popup({
            id: 'pinView',
            content: 'hello, its me',
        });
    }


    render() {
        let list = [];

        // this.context.pins = fakePins;

        if (this.context.pins) {
            this.context.pins.forEach((pin) => {
                const card = new Card(pin);
                list.push(card.render());
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
