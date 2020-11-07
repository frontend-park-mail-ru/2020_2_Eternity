import template from './main.hbs'

import BaseView from "../BaseView.js";

import Card from "../../components/card/card.js";


export default class MainPage extends BaseView {
    constructor(context = {}) {
        super('Главная', context, null);
        this.template = template;
    }


    render() {
        let list = [];
        this.context.pins.forEach((pin) => {
            const card = new Card(pin);
            list.push(card.render());
        });

        const data = {
            pins: list,
        }

        this.fillWith(data);
        super.render()
    }
}
